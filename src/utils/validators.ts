export function isValidQuantity(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidTicker(ticker: string | null): ticker is string {
  return typeof ticker === 'string' && ticker.length > 0;
}
