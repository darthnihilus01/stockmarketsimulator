import { create } from 'zustand';
import type { TabId, StockData, NewsItem, PortfolioState, OrderAction, ChartType } from '@/types';
import { createInitialStocks, tickPrice } from '@/services/priceEngine';
import { createInitialPortfolio, applyTradeToPortfolio } from '@/services/portfolioEngine';
import { executeTrade, validateTrade } from '@/services/tradeEngine';
import { generateNewsItem } from '@/services/newsEngine';

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

  setActiveTab: (tab: TabId) => void;
  setSelectedTicker: (ticker: string | null) => void;
  setOrderAction: (action: OrderAction) => void;
  setQuantity: (qty: number) => void;
  setChartType: (type: ChartType) => void;
  setTimeframe: (tf: string) => void;
  tickPrices: () => void;
  addNews: () => void;
  submitOrder: () => string | null;
  clearOrder: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (text: string) => void;
}

export const useStore = create<AppState>((set, get) => {
  const initialStocks = createInitialStocks();
  const initialPortfolio = createInitialPortfolio();

  return {
    activeTab: 'trade',
    stocks: initialStocks,
    selectedTicker: 'AAPL',
    orderAction: 'BUY',
    quantity: 100,
    chartType: 'line',
    timeframe: '1D',
    news: [
      { id: 'init1', time: '09:05:22', text: 'MSFT ACQUISITION RUMORS INTENSIFY', type: 'NORMAL' },
      { id: 'init2', time: '09:15:00', text: '[MACRO] UNEMPLOYMENT DATA SHOWS DECLINE', type: 'NORMAL' },
      { id: 'init3', time: '09:25:10', text: 'TSLA SECURES NEW GIGAFACTORY LOCATION', type: 'NORMAL' },
      { id: 'init4', time: '09:28:42', text: '[URGENT] AAPL Q3 EARNINGS MISS ESTIMATES', type: 'URGENT' },
      { id: 'init5', time: '09:30:15', text: '[MACRO] FED ANNOUNCES INTEREST RATE DECISION', type: 'NORMAL' },
    ],
    portfolio: initialPortfolio,
    notifications: [],

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedTicker: (ticker) => set({ selectedTicker: ticker }),
    setOrderAction: (action) => set({ orderAction: action }),
    setQuantity: (qty) => set({ quantity: Math.max(1, qty) }),
    setChartType: (type) => set({ chartType: type }),
    setTimeframe: (tf) => set({ timeframe: tf }),

    tickPrices: () => {
      set((state) => ({ stocks: tickPrice(state.stocks) }));
    },

    addNews: () => {
      const item = generateNewsItem();
      set((state) => ({ news: [...state.news, item] }));
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
        news: [...state.news, {
          id: `trade_news_${Date.now()}`,
          time: trade.time,
          text: `[TRADE] INDIVIDUAL ACCOUNT ${orderAction}S ${quantity} SHARES OF ${selectedTicker}`,
          type: 'ALERT',
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
