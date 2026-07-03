// spec: 4.9 — Portfolio calculations
// Trades execute using current market price.
// Portfolio updates every tick.

import type { PortfolioState, Trade, StockData } from '@/types';
import { executeTrade, validateTrade } from '@/services/tradeEngine';
import { applyTradeToPortfolio } from '@/services/portfolioEngine';

export function computeTotalPositionValue(
  positions: PortfolioState['positions'],
  currentPrices: Record<string, number>,
): number {
  let total = 0;
  for (const [ticker, pos] of Object.entries(positions)) {
    const price = currentPrices[ticker] ?? pos.averageCost;
    total += pos.shares * price;
  }
  return total;
}

export function computePortfolioValue(
  portfolio: PortfolioState,
  currentPrices: Record<string, number>,
): number {
  return portfolio.cash + computeTotalPositionValue(portfolio.positions, currentPrices);
}

export function computeUnrealizedPnl(
  positions: PortfolioState['positions'],
  currentPrices: Record<string, number>,
): number {
  let total = 0;
  for (const [ticker, pos] of Object.entries(positions)) {
    const price = currentPrices[ticker] ?? pos.averageCost;
    total += pos.shares * (price - pos.averageCost);
  }
  return total;
}

export function computeAbsoluteReturn(
  portfolioValue: number,
  startingCapital: number,
): number {
  return portfolioValue - startingCapital;
}

export function computeAbsoluteReturnPct(
  portfolioValue: number,
  startingCapital: number,
): number {
  if (startingCapital <= 0) return 0;
  return ((portfolioValue - startingCapital) / startingCapital) * 100;
}

export function tryExecuteOrder(
  selectedTicker: string | null,
  quantity: number,
  orderAction: 'BUY' | 'SELL',
  portfolio: PortfolioState,
  stocks: Record<string, StockData>,
): { trade: Trade | null; newPortfolio: PortfolioState | null; error: string | null } {
  const stock = selectedTicker ? stocks[selectedTicker] : undefined;
  const currentPosition = selectedTicker
    ? (portfolio.positions[selectedTicker]?.shares ?? 0)
    : 0;

  const error = validateTrade(
    selectedTicker,
    quantity,
    orderAction,
    portfolio.cash,
    stock,
    currentPosition,
  );
  if (error) return { trade: null, newPortfolio: null, error };

  if (!selectedTicker || !stock) {
    return { trade: null, newPortfolio: null, error: 'Invalid state' };
  }

  const trade = executeTrade(selectedTicker, orderAction, quantity, stock.price);
  const newPortfolio = applyTradeToPortfolio(portfolio, trade, stocks);
  return { trade, newPortfolio, error: null };
}
