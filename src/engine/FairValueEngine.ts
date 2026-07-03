import type { StockDefinition } from '@/types';

const PERMANENCE_FRACTION = 0.02;

export function computeFairValueReturn(
  stock: StockDefinition,
  factorStrengths: Record<string, number>,
  marketReturn: number,
): { fairValueReturn: number; factorImpact: number; marketImpact: number } {
  let factorImpact = 0;

  for (const [factorId, beta] of Object.entries(stock.factorBetas)) {
    const strength = factorStrengths[factorId] ?? 0;
    factorImpact += beta * strength;
  }

  const marketImpact = stock.marketBeta * marketReturn;

  const fairValueReturn = factorImpact + marketImpact;

  return { fairValueReturn, factorImpact, marketImpact };
}

export function computePartialPermanence(
  previousReturn: number,
): number {
  return previousReturn * PERMANENCE_FRACTION;
}

export function computeMeanReversionTarget(
  currentPrice: number,
  basePrice: number,
  reversionStrength: number,
): number {
  const deviation = (currentPrice - basePrice) / basePrice;
  return -deviation * reversionStrength;
}
