import { create } from 'zustand';
import type { TabId, StockData, NewsItem, PortfolioState, OrderAction, ChartType, MarketState } from '@/types';
import { STOCK_DEFINITIONS } from '@/engine/seed/stocks';
import { applyTradeToPortfolio } from '@/services/portfolioEngine';
import { executeTrade, validateTrade } from '@/services/tradeEngine';

function createInitialPortfolio(): PortfolioState {
  const totalMarket = STOCK_DEFINITIONS.reduce((sum, s) => sum + s.basePrice, 0);
  return {
    cash: 1000000,
    startingCapital: 1000000,
    positions: {},
    tradeHistory: [],
    valueHistory: [
      { time: '09:30:00', portfolio: 1000000, market: totalMarket },
    ],
  };
}

interface AppState {
  activeTab: TabId;
  stocks: Record<string, StockData>;
  selectedTicker: string | null;
  orderAction: OrderAction;
  quantity: number;
  chartType: ChartType;
  timeframe: string;
  news: NewsItem[];
  portfolio: PortfolioState;
  notifications: { id: string; text: string }[];
  marketState: MarketState;
  tick: number;

  setActiveTab: (tab: TabId) => void;
  setSelectedTicker: (ticker: string | null) => void;
  setOrderAction: (action: OrderAction) => void;
  setQuantity: (qty: number) => void;
  setChartType: (type: ChartType) => void;
  setTimeframe: (tf: string) => void;
  applySnapshot: (data: {
    stocks: StockData[];
    news: NewsItem[];
    marketState: MarketState;
    tick: number;
  }) => void;
  submitOrder: () => string | null;
  clearOrder: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (text: string) => void;
}

export const useStore = create<AppState>((set, get) => {
  const initialPortfolio = createInitialPortfolio();

  return {
    activeTab: 'trade',
    stocks: {},
    selectedTicker: 'AAPL',
    orderAction: 'BUY',
    quantity: 100,
    chartType: 'line',
    timeframe: '1D',
    news: [],
    portfolio: initialPortfolio,
    notifications: [],
    marketState: { tick: 0, factorStrengths: {}, activeContributions: [], marketReturn: 0 },
    tick: 0,

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),
    setOrderAction: (action) => set({ orderAction: action }),
    setQuantity: (qty) => set({ quantity: Math.max(1, qty) }),
    setChartType: (type) => set({ chartType: type }),
    setTimeframe: (tf) => set({ timeframe: tf }),

    applySnapshot: (data) => {
      const newStocks: Record<string, StockData> = {};
      for (const s of data.stocks) {
        newStocks[s.symbol] = s;
      }

      const currentPrices: Record<string, number> = {};
      for (const s of data.stocks) {
        currentPrices[s.symbol] = s.price;
      }

      const state = get();
      const port = state.portfolio;
      let totalPositionValue = 0;
      for (const [ticker, pos] of Object.entries(port.positions)) {
        const price = currentPrices[ticker] ?? pos.averageCost;
        totalPositionValue += pos.shares * price;
      }

      const totalMarket = STOCK_DEFINITIONS.reduce((sum, s) => sum + s.basePrice, 0);
      const portfolioValue = port.cash + totalPositionValue;

      const newValueHistory = [
        ...port.valueHistory,
        {
          time: data.tick.toString(),
          portfolio: portfolioValue,
          market: totalMarket * (1 + data.marketState.marketReturn),
        },
      ].slice(-500);

      set({
        stocks: newStocks,
        news: data.news,
        marketState: data.marketState,
        tick: data.tick,
        portfolio: {
          ...port,
          valueHistory: newValueHistory,
        },
      });
    },

    submitOrder: () => {
      const state = get();
      const { selectedTicker, orderAction, quantity, stocks, portfolio } = state;
      const stock = selectedTicker ? stocks[selectedTicker] : undefined;
      const currentPosition = selectedTicker ? (portfolio.positions[selectedTicker]?.shares ?? 0) : 0;

      const error = validateTrade(selectedTicker, quantity, orderAction, portfolio.cash, stock, currentPosition);
      if (error) return error;

      if (!selectedTicker || !stock) return 'Invalid state';
      const trade = executeTrade(selectedTicker, orderAction, quantity, stock.price);
      const newPortfolio = applyTradeToPortfolio(portfolio, trade, stocks);

      set({
        portfolio: newPortfolio,
        notifications: [...state.notifications, {
          id: `notif_${Date.now()}`,
          text: `EXECUTED: ${orderAction} ${quantity} ${selectedTicker} @ $${stock.price.toFixed(2)}`,
        }],
      });

      return null;
    },

    clearOrder: () => {
      set({ selectedTicker: 'AAPL', orderAction: 'BUY', quantity: 100 });
    },

    dismissNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    },

    addNotification: (text) => {
      const id = `notif_${Date.now()}`;
      set((state) => ({
        notifications: [...state.notifications, { id, text }],
      }));
      setTimeout(() => {
        get().dismissNotification(id);
      }, 4500);
    },
  };
});
