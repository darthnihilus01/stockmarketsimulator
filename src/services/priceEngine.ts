import type { Candle, Level2Row, StockData } from '@/types';

export const INITIAL_STOCKS: Record<string, { name: string; basePrice: number; type?: string; research?: string }> = {
  AAPL: { name: 'APPLE INC.', basePrice: 150.25, type: 'EQUITY', research: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. The company has a strong ecosystem with high customer loyalty and recurring services revenue.' },
  MSFT: { name: 'MICROSOFT CORP.', basePrice: 320.50, type: 'EQUITY', research: 'Microsoft is a leading technology company focused on cloud computing, enterprise software, and AI. Azure continues to gain market share against competitors.' },
  TSLA: { name: 'TESLA INC.', basePrice: 240.80, type: 'EQUITY', research: 'Tesla is an electric vehicle manufacturer and clean energy company. The company faces increasing competition but maintains technological leadership in battery technology and autonomous driving.' },
  NVDA: { name: 'NVIDIA CORP.', basePrice: 450.15, type: 'EQUITY', research: 'NVIDIA is the dominant player in AI chips and data center GPUs. The company has experienced explosive growth driven by AI infrastructure spending across hyperscalers.' },
  BTC: { name: 'BITCOIN COINBASE', basePrice: 58250.0, type: 'CRYPTO', research: 'Bitcoin is the largest cryptocurrency by market capitalization. It serves as a digital store of value and hedge against monetary debasement. Subject to regulatory developments.' },
};

export function generateHistory(basePrice: number, count = 40): Candle[] {
  const history: Candle[] = [];
  let currentPrice = basePrice * 0.95;
  const now = new Date();

  for (let i = count; i > 0; i--) {
    const candleTime = new Date(now.getTime() - i * 60000);
    const open = currentPrice;
    const change = (Math.random() - 0.48) * (basePrice * 0.006);
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.003);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.003);
    const volume = Math.floor(Math.random() * 80000) + 20000;

    history.push({
      time: candleTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume,
    });
    currentPrice = close;
  }
  return history;
}

export function generateLevel2(price: number): Level2Row[] {
  const rows: Level2Row[] = [];
  const spread = price * 0.0005;
  for (let i = 0; i < 5; i++) {
    const bidPrice = price - spread - i * (price * 0.0002);
    const askPrice = price + spread + i * (price * 0.0002);
    rows.push({
      bidPrice: parseFloat(bidPrice.toFixed(2)),
      bidSize: Math.floor(Math.random() * 25 + 1) * 100,
      askPrice: parseFloat(askPrice.toFixed(2)),
      askSize: Math.floor(Math.random() * 25 + 1) * 100,
    });
  }
  return rows;
}

export function createInitialStocks(): Record<string, StockData> {
  const stocks: Record<string, StockData> = {};
  Object.entries(INITIAL_STOCKS).forEach(([symbol, info]) => {
    const history = generateHistory(info.basePrice);
    const latestPrice = history[history.length - 1].close;
    stocks[symbol] = {
      symbol,
      name: info.name,
      price: latestPrice,
      prevClose: info.basePrice,
      bid: parseFloat((latestPrice - latestPrice * 0.0002).toFixed(2)),
      ask: parseFloat((latestPrice + latestPrice * 0.0002).toFixed(2)),
      bidSize: Math.floor(Math.random() * 15 + 1) * 100,
      askSize: Math.floor(Math.random() * 15 + 1) * 100,
      history,
      level2: generateLevel2(latestPrice),
      type: info.type,
      research: info.research,
    };
  });
  return stocks;
}

export function tickPrice(stocks: Record<string, StockData>): Record<string, StockData> {
  const next = { ...stocks };
  const symbols = Object.keys(next);
  const tickSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const stock = next[tickSymbol];

  const changePercent = (Math.random() - 0.5) * 0.003;
  const newPrice = parseFloat((stock.price * (1 + changePercent)).toFixed(2));
  const spread = newPrice * 0.0004;
  const newBid = parseFloat((newPrice - spread / 2).toFixed(2));
  const newAsk = parseFloat((newPrice + spread / 2).toFixed(2));

  const newHistory = [...stock.history];
  const lastCandle = { ...newHistory[newHistory.length - 1] };
  lastCandle.close = newPrice;
  if (newPrice > lastCandle.high) lastCandle.high = newPrice;
  if (newPrice < lastCandle.low) lastCandle.low = newPrice;
  lastCandle.volume += Math.floor(Math.random() * 1500) + 100;
  newHistory[newHistory.length - 1] = lastCandle;

  const newLevel2 = stock.level2.map((row, idx) => {
    const shift = idx * (newPrice * 0.0002);
    return {
      bidPrice: parseFloat((newBid - shift).toFixed(2)),
      bidSize: Math.max(100, row.bidSize + (Math.random() > 0.5 ? 100 : -100)),
      askPrice: parseFloat((newAsk + shift).toFixed(2)),
      askSize: Math.max(100, row.askSize + (Math.random() > 0.5 ? 100 : -100)),
    };
  });

  next[tickSymbol] = {
    ...stock,
    price: newPrice,
    bid: newBid,
    ask: newAsk,
    bidSize: Math.max(100, stock.bidSize + (Math.random() > 0.5 ? 100 : -100)),
    askSize: Math.max(100, stock.askSize + (Math.random() > 0.5 ? 100 : -100)),
    history: newHistory,
    level2: newLevel2,
  };

  return next;
}
