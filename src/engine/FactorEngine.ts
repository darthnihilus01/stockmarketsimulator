import { FACTORS, FACTOR_CORRELATION_MATRIX, FACTOR_NOISE_SIGMA, FACTOR_IDS } from './seed/factors';
import { choleskyDecomposition, applyCholesky, normalRandom, clamp } from './MathUtils';
import type { FactorContribution } from '@/types';

const FACTOR_MEAN_REVERSION_RATE = 0.01;
const FACTOR_SIGMA = 0.15;

let choleskyCache: number[][] | null = null;

function getCholesky(): number[][] {
  if (!choleskyCache) {
    choleskyCache = choleskyDecomposition(FACTOR_CORRELATION_MATRIX);
    if (!choleskyCache) {
      choleskyCache = Array.from({ length: FACTOR_IDS.length }, (_, i) => {
        const row = new Array(FACTOR_IDS.length).fill(0);
        row[i] = 1;
        return row;
      });
    }
  }
  return choleskyCache;
}

export function generateCorrelatedFactorReturns(): number[] {
  const L = getCholesky();
  const uncorrelated = FACTOR_IDS.map(() => normalRandom());
  return applyCholesky(L, uncorrelated);
}

export function computeFactorReturns(
  currentStrengths: Record<string, number>,
  activeContributions: FactorContribution[],
  tick: number,
): { newStrengths: Record<string, number>; innovation: number } {
  const correlatedShocks = generateCorrelatedFactorReturns();
  let marketInnovation = 0;

  const newStrengths: Record<string, number> = {};

  for (let i = 0; i < FACTOR_IDS.length; i++) {
    const fId = FACTOR_IDS[i];
    const current = currentStrengths[fId] ?? 0;

    const contributionSum = activeContributions
      .filter((c) => c.factorId === fId && tick < c.expiryTick)
      .reduce((sum, c) => sum + c.strength, 0);

    const meanReversion = -FACTOR_MEAN_REVERSION_RATE * current;

    const noiseShock = correlatedShocks[i] * FACTOR_SIGMA;
    const contributionDecay = -current * 0.001;

    const delta = meanReversion + contributionSum + noiseShock + contributionDecay;

    newStrengths[fId] = clamp(current + delta, -1, 1);

    if (fId === 'risk') {
      marketInnovation += Math.abs(newStrengths[fId] - current) * 0.5;
    }
    if (fId === 'domestic') {
      marketInnovation += (newStrengths[fId] - current) * 0.3;
    }
    if (fId === 'consumer') {
      marketInnovation += (newStrengths[fId] - current) * 0.2;
    }
  }

  return { newStrengths, innovation: clamp(marketInnovation, -0.5, 0.5) };
}
