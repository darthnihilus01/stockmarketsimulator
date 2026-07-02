export function formatCurrency(value: number, decimals = 2): string {
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercent(value: number, decimals = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatDelta(value: number): string {
  return value >= 0 ? `+${formatCurrency(value)}` : formatCurrency(value);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour12: false });
}

export function truncateDecimals(value: number, decimals = 2): number {
  return parseFloat(value.toFixed(decimals));
}
