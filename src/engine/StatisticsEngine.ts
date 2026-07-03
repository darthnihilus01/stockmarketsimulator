// spec: 4.9 — Portfolio calculations: Sharpe Ratio, Relative Market Return

export function computeSharpeRatio(
  portfolioValues: number[],
  riskFreeRate: number = 0.02,
): number {
  if (portfolioValues.length < 2) return 0;

  const returns: number[] = [];
  for (let i = 1; i < portfolioValues.length; i++) {
    if (portfolioValues[i - 1] === 0) continue;
    returns.push(
      (portfolioValues[i] - portfolioValues[i - 1]) / portfolioValues[i - 1],
    );
  }

  if (returns.length < 2) return 0;

  const meanReturn = returns.reduce((s, r) => s + r, 0) / returns.length;
  const variance =
    returns.reduce((s, r) => s + (r - meanReturn) ** 2, 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return 0;

  const excessReturn = meanReturn - riskFreeRate / 252;
  return (excessReturn / stdDev) * Math.sqrt(252);
}

export function computeRelativeReturn(
  portfolioValues: number[],
  marketValues: number[],
): number {
  if (portfolioValues.length < 2 || marketValues.length < 2) return 0;

  const portReturn =
    (portfolioValues[portfolioValues.length - 1] - portfolioValues[0]) /
    portfolioValues[0];
  const marketReturn =
    (marketValues[marketValues.length - 1] - marketValues[0]) /
    marketValues[0];

  return portReturn - marketReturn;
}
