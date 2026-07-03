// spec: 4.3 — Factor Returns
// F(t) = ν × (Lz) ⊙ σ_factor + S(t)

import { FACTORS, FACTOR_CORRELATION_MATRIX, FACTOR_IDS, FACTOR_SIGMA } from './seed/factors';
import { VOL_SCALE } from './constants';
import { choleskyDecomposition, isPSD, nearestPSD, applyCholesky } from './math/Correlation';
import { getGlobalRng } from './math/Random';

let choleskyCache: number[][] | null = null;
let psdChecked = false;

export function getFactorCount(): number {
  return FACTOR_IDS.length;
}

export function getFactorIds(): string[] {
  return FACTOR_IDS;
}

export function initializeFactorEngine(): void {
  let C = FACTOR_CORRELATION_MATRIX;
  if (!isPSD(C)) {
    console.warn('FactorEngine: correlation matrix not PSD, repairing...');
    C = nearestPSD(C);
  }
  choleskyCache = choleskyDecomposition(C);
  psdChecked = true;
}

// spec: 4.3 — F(t) = ν × (Lz) ⊙ σ_factor + S(t)
export function computeFactorReturns(
  factorShocks: Record<string, number>,
): number[] {
  if (!choleskyCache || !psdChecked) {
    initializeFactorEngine();
  }

  const rng = getGlobalRng();
  const n = FACTOR_IDS.length;

  // z ~ N(0, I)
  const z = new Array(n).fill(0).map(() => rng.nextNormal());

  // Lz — correlated standard normals
  const correlated: number[] = choleskyCache
    ? applyCholesky(choleskyCache, z)
    : z;

  // F(t) = ν × (Lz) ⊙ σ_factor + S(t)
  const factorReturns: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const fId = FACTOR_IDS[i];
    const sigma = FACTOR_SIGMA[i] ?? 0.1;
    const shock = factorShocks[fId] ?? 0;
    factorReturns[i] = VOL_SCALE * correlated[i] * sigma + shock;
  }

  return factorReturns;
}

// spec: 4.3 — aggregate factor news S(t)
export function getFactorNews(
  factorId: string,
  activeEvents: { targetFactor: string; shock: number }[],
): number {
  let total = 0;
  for (const ev of activeEvents) {
    if (ev.targetFactor === factorId) {
      total += ev.shock;
    }
  }
  return total;
}
