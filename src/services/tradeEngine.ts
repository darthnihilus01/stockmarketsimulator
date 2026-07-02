import type { Trade, OrderAction, StockData } from '@/types';
import { formatTime } from '@/utils/formatters';

let tradeCounter = 0;

export function executeTrade(
  ticker: string,
  action: OrderAction,
  quantity: number,
  price: number,
): Trade {
  tradeCounter++;
  return {
    id: `TRADE_${tradeCounter}_${Date.now()}`,
    time: formatTime(new Date()),
    ticker,
    action,
    quantity,
    price,
    total: quantity * price,
  };
}

export function validateTrade(
  ticker: string | null,
  quantity: number,
  action: OrderAction,
  cash: number,
  stock: StockData | undefined,
  currentPosition: number,
): string | null {
  if (!ticker) return 'Select a ticker';
  if (!stock) return 'Invalid ticker';
  if (!Number.isInteger(quantity) || quantity <= 0) return 'Quantity must be at least 1';
  if (action === 'BUY' && quantity * stock.price > cash) return 'Insufficient cash';
  if (action === 'SELL' && quantity > currentPosition) return 'Insufficient shares';
  return null;
}
