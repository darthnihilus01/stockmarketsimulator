import type { PortfolioState, StockData } from '@/types';

export function calculateUnrealisedGain(shares: number, averageCost: number, currentPrice: number): number {
  return shares * (currentPrice - averageCost);
}

export function calculateTotalPortfolioValue(portfolio: PortfolioState, stocks: Record<string, StockData>): number {
  const marketValue = Object.entries(portfolio.positions).reduce((sum, [ticker, pos]) => {
    const stock = stocks[ticker];
    return stock ? sum + pos.shares * stock.price : sum;
  }, 0);
  return portfolio.cash + marketValue;
}

export function calculateAbsoluteReturn(portfolio: PortfolioState, stocks: Record<string, StockData>): number {
  const total = calculateTotalPortfolioValue(portfolio, stocks);
  return (total - portfolio.startingCapital) / portfolio.startingCapital;
}

export function calculateSharpeRatio(portfolio: PortfolioState, _stocks: Record<string, StockData>): number {
  if (portfolio.valueHistory.length < 2) return 0;
  const returns = portfolio.valueHistory.map((v, i, arr) => {
    if (i === 0) return 0;
    return (v.portfolio - arr[i - 1].portfolio) / arr[i - 1].portfolio;
  }).filter(r => r !== 0);
  if (returns.length < 2) return 0;
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - avg) ** 2, 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  return stdDev === 0 ? 0 : avg / stdDev;
}

export function calculateVsMarketReturn(portfolio: PortfolioState, stocks: Record<string, StockData>): number {
  const total = calculateTotalPortfolioValue(portfolio, stocks);
  const portfolioReturn = (total - portfolio.startingCapital) / portfolio.startingCapital;
  const tickers = Object.keys(stocks);
  if (tickers.length === 0) return 0;
  const marketReturn = tickers.reduce((sum, t) => {
    const s = stocks[t];
    return sum + (s.price - s.prevClose) / s.prevClose;
  }, 0) / tickers.length;
  return portfolioReturn - marketReturn;
}

export function calculatePositionAverageCost(existingShares: number, existingCost: number, newShares: number, newPrice: number): number {
  const totalCost = existingShares * existingCost + newShares * newPrice;
  const totalShares = existingShares + newShares;
  return totalShares === 0 ? 0 : totalCost / totalShares;
}
