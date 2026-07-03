// spec: 4.2.2 — Market return
// M(t) = ν × σ_market × ξ(t)

import { VOL_SCALE, SIGMA_MARKET } from './constants';
import { getGlobalRng } from './math/Random';

export function generateMarketReturn(): number {
  const rng = getGlobalRng();
  const xi = rng.nextNormal();
  return VOL_SCALE * SIGMA_MARKET * xi;
}
