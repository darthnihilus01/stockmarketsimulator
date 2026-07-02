import type { PortfolioState, StockData, Trade, Position } from '@/types';
import { calculatePositionAverageCost } from '@/utils/calculations';

export function applyTradeToPortfolio(
  portfolio: PortfolioState,
  trade: Trade,
  stocks: Record<string, StockData>,
): PortfolioState {
  const { ticker, action, quantity, price, total } = trade;
  const currentPos = portfolio.positions[ticker] || { ticker, shares: 0, averageCost: 0 };

  let newCash: number;
  let newPosition: Position;

  if (action === 'BUY') {
    newCash = portfolio.cash - total;
    newPosition = {
      ticker,
      shares: currentPos.shares + quantity,
      averageCost: calculatePositionAverageCost(
        currentPos.shares,
        currentPos.averageCost,
        quantity,
        price,
      ),
    };
  } else {
    newCash = portfolio.cash + total;
    const remainingShares = currentPos.shares - quantity;
    newPosition = {
      ticker,
      shares: remainingShares,
      averageCost: remainingShares > 0 ? currentPos.averageCost : 0,
    };
  }

  const newPositions = { ...portfolio.positions };
  if (newPosition.shares <= 0) {
    delete newPositions[ticker];
  } else {
    newPositions[ticker] = newPosition;
  }

  const portfolioValue = newCash + Object.entries(newPositions).reduce((sum, [t, pos]) => {
    const stock = stocks[t];
    return stock ? sum + pos.shares * stock.price : sum;
  }, 0);

  const marketValues = Object.values(stocks).map(s => s.price);
  const avgMarket = marketValues.length > 0 ? marketValues.reduce((a, b) => a + b, 0) / marketValues.length : 0;
  const marketIndex = avgMarket * Object.keys(stocks).length;

  const newHistory = [
    ...portfolio.valueHistory,
    { time: trade.time, portfolio: portfolioValue, market: marketIndex },
  ];

  return {
    cash: newCash,
    startingCapital: portfolio.startingCapital,
    positions: newPositions,
    tradeHistory: [...portfolio.tradeHistory, trade],
    valueHistory: newHistory,
  };
}

export function createInitialPortfolio(): PortfolioState {
  return {
    cash: 1000000,
    startingCapital: 1000000,
    positions: {},
    tradeHistory: [],
    valueHistory: [],
  };
}
