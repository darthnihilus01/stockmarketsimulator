// spec: 4.4.3 — exponential decay

import { REF_TAU } from '../constants';

export function computeShock(
  score: number,
  gain: number,
  tau: number,
  currentTick: number,
  creationTick: number,
): number {
  const elapsed = currentTick - creationTick;
  return score * gain * Math.exp(-elapsed / tau) * (REF_TAU / tau);
}
