import type { PortfolioState, MetricCardData } from '@/types';

export function computePortfolioMetrics(
  portfolio: PortfolioState,
  currentPrices: Record<string, number>,
): MetricCardData[] {
  const { cash, positions } = portfolio;

  let totalPositionValue = 0;
  let totalCost = 0;
  let totalUnrealisedPnl = 0;

  for (const [ticker, pos] of Object.entries(positions)) {
    const currentPrice = currentPrices[ticker] ?? pos.averageCost;
    const positionValue = pos.shares * currentPrice;
    const costValue = pos.shares * pos.averageCost;
    totalPositionValue += positionValue;
    totalCost += costValue;
    totalUnrealisedPnl += positionValue - costValue;
  }

  const totalPortfolioValue = cash + totalPositionValue;
  const unrealisedPnl = totalUnrealisedPnl;
  const absoluteReturn = totalPortfolioValue - portfolio.startingCapital;
  const absoluteReturnPct = portfolio.startingCapital > 0
    ? (absoluteReturn / portfolio.startingCapital) * 100
    : 0;

  const returns = portfolio.valueHistory
    .map((v, i, arr) => {
      if (i === 0) return 0;
      return (v.portfolio - arr[i - 1].portfolio) / arr[i - 1].portfolio;
    })
    .filter((r) => r !== 0);

  let sharpeRatio = 0;
  if (returns.length > 1) {
    const meanReturn = returns.reduce((s, r) => s + r, 0) / returns.length;
    const variance = returns.reduce((s, r) => s + (r - meanReturn) ** 2, 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);
    sharpeRatio = stdDev > 0 ? (meanReturn * 252) / (stdDev * Math.sqrt(252)) : 0;
  } else {
    sharpeRatio = 0;
  }

  const vsMarket = portfolio.valueHistory.length > 1
    ? ((portfolio.valueHistory[portfolio.valueHistory.length - 1]?.portfolio ?? 0) /
        (portfolio.valueHistory[0]?.portfolio ?? 1)) *
      100 -
      100
    : 0;

  const vsMarketChange = portfolio.valueHistory.length > 1
    ? ((portfolio.valueHistory[portfolio.valueHistory.length - 1]?.market ?? 0) /
        (portfolio.valueHistory[0]?.market ?? 1)) *
      100 -
      100
    : 0;

  return [
    {
      label: 'Cash',
      value: `$${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      isPercentage: false,
    },
    {
      label: 'Unrealised P&L',
      value: `${unrealisedPnl >= 0 ? '+' : ''}$${unrealisedPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      delta: unrealisedPnl,
      isPercentage: false,
    },
    {
      label: 'Total Portfolio',
      value: `$${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      isPercentage: false,
    },
    {
      label: 'Return %',
      value: `${absoluteReturnPct >= 0 ? '+' : ''}${absoluteReturnPct.toFixed(2)}%`,
      delta: absoluteReturnPct,
      isPercentage: true,
    },
    {
      label: 'Sharpe Ratio',
      value: sharpeRatio.toFixed(2),
      delta: sharpeRatio,
      isPercentage: false,
    },
    {
      label: 'Portfolio vs Market',
      value: `${vsMarket >= 0 ? '+' : ''}${vsMarket.toFixed(2)}% / ${vsMarketChange >= 0 ? '+' : ''}${vsMarketChange.toFixed(2)}%`,
      delta: vsMarket - vsMarketChange,
      isPercentage: true,
    },
  ];
}

export function computePortfolioPerformanceLine(
  portfolio: PortfolioState,
): { time: string; portfolio: number; market: number }[] {
  return portfolio.valueHistory;
}

export function getPositionsWithPrices(
  portfolio: PortfolioState,
  currentPrices: Record<string, number>,
) {
  return Object.entries(portfolio.positions).map(([ticker, pos]) => {
    const currentPrice = currentPrices[ticker] ?? pos.averageCost;
    const marketValue = pos.shares * currentPrice;
    const costValue = pos.shares * pos.averageCost;
    const pnl = marketValue - costValue;
    const pnlPct = costValue > 0 ? (pnl / costValue) * 100 : 0;
    return {
      ticker,
      shares: pos.shares,
      avgCost: pos.averageCost,
      currentPrice,
      marketValue,
      pnl,
      pnlPct,
    };
  });
}
