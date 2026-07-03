// spec: 4.2, 4.8 — Per-stock return computation
// r(i,t) = μ(i) + β_market(i) × M(t) + N(i,t) + R(i,t) + ν × m_idio × σ_idio(i) × ε(i,t)
// P(i,t) = P(i,t-1) × exp(r(i,t))

import { DRIFT, VOL_SCALE, M_IDIO, KAPPA } from './constants';
import { getGlobalRng } from './math/Random';
import { updateFairValue, computeMeanReversion } from './FairValueEngine';
import { aggregateTickerNews } from './NewsEngine';
import type { HeadlineEvent } from './NewsEngine';

export interface StockState {
  symbol: string;
  betaMarket: number;
  factorBetas: number[];
  sigmaIdio: number;
  price: number;
}

// spec: 4.2.1 — N(i,t) = β(i) · F(t) + S_stock(i,t)
function computeNewsComponent(
  factorBetas: number[],
  factorReturns: number[],
  tickerNews: number,
): number {
  let betaDotF = 0;
  const minLen = Math.min(factorBetas.length, factorReturns.length);
  for (let i = 0; i < minLen; i++) {
    betaDotF += factorBetas[i] * factorReturns[i];
  }
  return betaDotF + tickerNews;
}

// spec: 4.2, 4.8 step 8 — Compute full return for one stock
// r(i,t) = μ(i) + β_market(i) × M(t) + N(i,t) + R(i,t) + ν × m_idio × σ_idio(i) × ε(i,t)
export function computeStockReturn(
  stock: StockState,
  marketReturn: number,
  factorReturns: number[],
  headlineEvents: HeadlineEvent[],
  currentTick: number,
): { return: number; newsComponent: number } {
  const rng = getGlobalRng();

  // 1. Drift μ(i)
  const drift = DRIFT;

  // 2. Market contribution: β_market(i) × M(t)
  const marketContrib = stock.betaMarket * marketReturn;

  // 3. News: N(i,t) = β(i) · F(t) + S_stock(i,t)
  const tickerNews = aggregateTickerNews(headlineEvents, stock.symbol, currentTick);
  const newsComponent = computeNewsComponent(stock.factorBetas, factorReturns, tickerNews);

  // 4. Update Fair Value: A(i) = A(i) × exp(φ × N(i))
  // spec: 4.6 — using newsComponent as N(i)
  updateFairValue(stock.symbol, newsComponent);

  // 5. Mean Reversion: R(i) = κ × (ln(A(i)) - ln(P(i)))
  const meanReversion = computeMeanReversion(stock.symbol, stock.price, KAPPA);

  // 6. Idiosyncratic Noise: ν × m_idio × σ_idio(i) × ε(i,t)
  const epsilon = rng.nextNormal();
  const noise = VOL_SCALE * M_IDIO * stock.sigmaIdio * epsilon;

  // 7. Total return
  const totalReturn = drift + marketContrib + newsComponent + meanReversion + noise;

  return { return: totalReturn, newsComponent };
}

// spec: 4.2 — P(i,t) = P(i,t-1) × exp(r(i,t))
export function updatePrice(
  currentPrice: number,
  stockReturn: number,
): number {
  return currentPrice * Math.exp(stockReturn);
}
