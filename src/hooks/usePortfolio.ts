'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { calculateUnrealisedGain, calculateTotalPortfolioValue, calculateAbsoluteReturn, calculateSharpeRatio, calculateVsMarketReturn } from '@/utils/calculations';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import type { MetricCardData } from '@/types';

export function usePortfolio() {
  const portfolio = useStore((s) => s.portfolio);
  const stocks = useStore((s) => s.stocks);

  const metrics = useMemo((): MetricCardData[] => {
    const totalValue = calculateTotalPortfolioValue(portfolio, stocks);
    const absReturn = calculateAbsoluteReturn(portfolio, stocks);
    const sharpe = calculateSharpeRatio(portfolio, stocks);
    const vsMarket = calculateVsMarketReturn(portfolio, stocks);

    const unrealised = Object.entries(portfolio.positions).reduce((sum, [ticker, pos]) => {
      const stock = stocks[ticker];
      return stock ? sum + calculateUnrealisedGain(pos.shares, pos.averageCost, stock.price) : sum;
    }, 0);

    return [
      { label: 'Available Cash', value: `$${formatCurrency(portfolio.cash)}`, delta: 0 },
      { label: 'Unrealised Gain', value: `$${formatCurrency(unrealised)}`, delta: unrealised, deltaLabel: 'vs cost', isPercentage: false },
      { label: 'Total Portfolio', value: `$${formatCurrency(totalValue)}`, delta: absReturn, deltaLabel: 'all time', isPercentage: true },
      { label: 'Absolute Return %', value: formatPercent(absReturn * 100), delta: absReturn * 100, isPercentage: true },
      { label: 'Sharpe Ratio', value: sharpe.toFixed(2), delta: sharpe },
      { label: 'vs Market Return %', value: formatPercent(vsMarket * 100), delta: vsMarket * 100, isPercentage: true },
    ];
  }, [portfolio, stocks]);

  return { portfolio, stocks, metrics };
}
