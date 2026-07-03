// spec: 4.6 — Fair Value
// Every stock owns A(i), the hidden fair-value anchor.
// A(i) = A(i) × exp(φ × N(i))
// Only news changes fair value. Not market. Not noise. Not drift.

import { PHI } from './constants';
import type { StockDefinition } from '@/types';

const fairValueAnchors = new Map<string, number>();

export function initializeFairValue(
  stockDefs: StockDefinition[],
): void {
  for (const def of stockDefs) {
    fairValueAnchors.set(def.symbol, def.basePrice);
  }
}

export function setFairValue(symbol: string, value: number): void {
  fairValueAnchors.set(symbol, value);
}

// spec: 4.6 — A(i) = A(i) × exp(φ × N(i))
export function updateFairValue(
  symbol: string,
  newsComponent: number,
): number {
  const current = fairValueAnchors.get(symbol);
  if (current === undefined) return 0;
  const newValue = current * Math.exp(PHI * newsComponent);
  fairValueAnchors.set(symbol, newValue);
  return newValue;
}

export function getFairValue(symbol: string): number | undefined {
  return fairValueAnchors.get(symbol);
}

// spec: 4.7 — R(i) = κ × (ln(A(i)) - ln(P(i)))
export function computeMeanReversion(
  symbol: string,
  currentPrice: number,
  kappa: number,
): number {
  const A = fairValueAnchors.get(symbol);
  if (A === undefined || A <= 0 || currentPrice <= 0) return 0;
  return kappa * (Math.log(A) - Math.log(currentPrice));
}
