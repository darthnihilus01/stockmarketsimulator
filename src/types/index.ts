export type TabId = 'trade' | 'portfolio' | 'research';
export type OrderAction = 'BUY' | 'SELL';
export type ChartType = 'line' | 'candlestick';
export type NewsType = 'URGENT' | 'ALERT' | 'NORMAL';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Level2Row {
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  prevClose: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  history: Candle[];
  level2: Level2Row[];
  sector: string;
  research: string;
}

export interface NewsItem {
  id: string;
  time: string;
  text: string;
  type: NewsType;
}

export interface NewsAlert {
  id: string;
  time: string;
  title: string;
  headlines: string[];
  severity?: 'high' | 'medium' | 'low';
}

export interface Trade {
  id: string;
  time: string;
  ticker: string;
  action: OrderAction;
  quantity: number;
  price: number;
  total: number;
}

export interface Position {
  ticker: string;
  shares: number;
  averageCost: number;
}

export interface PortfolioState {
  cash: number;
  startingCapital: number;
  positions: Record<string, Position>;
  tradeHistory: Trade[];
  valueHistory: { time: string; portfolio: number; market: number }[];
}

export interface MetricCardData {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  isPercentage?: boolean;
}

export interface Factor {
  id: string;
  name: string;
}

export interface HeadlineMeta {
  id: string;
  time: number;
  text: string;
  targetFactor: string;
  targetScore: number;
  actualScore: number;
  tau: number;
  severity: 'high' | 'medium' | 'low';
}

export interface FactorContribution {
  factorId: string;
  strength: number;
  expiryTick: number;
}

export interface MarketState {
  tick: number;
  factorStrengths: Record<string, number>;
  activeContributions: FactorContribution[];
  marketReturn: number;
}

export interface TickData {
  time: number;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  return: number;
}

export interface StockDefinition {
  symbol: string;
  name: string;
  sector: string;
  basePrice: number;
  marketBeta: number;
  drift: number;
  factorBetas: Record<string, number>;
  research: string;
}

export interface SimulationState {
  tick: number;
  timeMs: number;
}
