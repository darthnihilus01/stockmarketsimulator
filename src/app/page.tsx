'use client';

import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Level2Row {
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
}

interface StockData {
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
}

interface NewsItem {
  id: string;
  time: string;
  text: string;
  type: 'URGENT' | 'ALERT' | 'NORMAL';
}

// ==========================================
// MOCK DATA INITIALIZATION HELPER
// ==========================================

const INITIAL_STOCKS: Record<string, { name: string; basePrice: number }> = {
  AAPL: { name: 'APPLE INC.', basePrice: 150.25 },
  MSFT: { name: 'MICROSOFT CORP.', basePrice: 320.50 },
  TSLA: { name: 'TESLA INC.', basePrice: 240.80 },
  NVDA: { name: 'NVIDIA CORP.', basePrice: 450.15 },
  BTC: { name: 'BITCOIN COINBASE', basePrice: 58250.0 },
};

function generateHistory(basePrice: number, count = 40): Candle[] {
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
      open,
      high,
      low,
      close,
      volume,
    });
    currentPrice = close;
  }
  return history;
}

function generateLevel2(price: number): Level2Row[] {
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

export default function TerminalPage() {
  const [stocks, setStocks] = useState<Record<string, StockData>>({});
  const [activeSymbol, setActiveSymbol] = useState<string>('AAPL');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sysTime, setSysTime] = useState<string>('');
  
  // Order Execution States
  const [orderAction, setOrderAction] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(100);
  const [orderType, setOrderType] = useState<string>('MARKET');
  const [notifications, setNotifications] = useState<{ id: string; text: string }[]>([]);

  // Command Prompt States
  const [command, setCommand] = useState<string>('');
  const [commandFeedback, setCommandFeedback] = useState<string>('CORE_CMD_PROMPT_v2.0.4');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initial Data Generation
  useEffect(() => {
    // Generate Stocks
    const initialStocks: Record<string, StockData> = {};
    Object.entries(INITIAL_STOCKS).forEach(([symbol, info]) => {
      const history = generateHistory(info.basePrice);
      const latestPrice = history[history.length - 1].close;
      initialStocks[symbol] = {
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
      };
    });
    setStocks(initialStocks);

    // Initial News
    setNews([
      {
        id: '1',
        time: '09:05:22',
        text: 'MSFT ACQUISITION RUMORS INTENSIFY',
        type: 'NORMAL',
      },
      {
        id: '2',
        time: '09:15:00',
        text: '[MACRO] UNEMPLOYMENT DATA SHOWS DECLINE',
        type: 'NORMAL',
      },
      {
        id: '3',
        time: '09:25:10',
        text: 'TSLA SECURES NEW GIGAFACTORY LOCATION',
        type: 'NORMAL',
      },
      {
        id: '4',
        time: '09:28:42',
        text: '[URGENT] AAPL Q3 EARNINGS MISS ESTIMATES',
        type: 'URGENT',
      },
      {
        id: '5',
        time: '09:30:15',
        text: '[MACRO] FED ANNOUNCES INTEREST RATE DECISION',
        type: 'NORMAL',
      },
    ]);
  }, []);

  // System Time Clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setSysTime(d.toLocaleTimeString([], { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Price Feed & Live Simulation Tick Loop
  useEffect(() => {
    if (Object.keys(stocks).length === 0) return;

    const interval = setInterval(() => {
      setStocks((prev) => {
        const next = { ...prev };
        
        // Randomly choose 1 stock to tick
        const symbols = Object.keys(next);
        const tickSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        const stock = next[tickSymbol];

        const changePercent = (Math.random() - 0.5) * 0.003; // max 0.15% change per tick
        const newPrice = parseFloat((stock.price * (1 + changePercent)).toFixed(2));
        
        // Update level 1 bid/ask
        const spread = newPrice * 0.0004;
        const newBid = parseFloat((newPrice - spread / 2).toFixed(2));
        const newAsk = parseFloat((newPrice + spread / 2).toFixed(2));

        // Update active candle in history
        const newHistory = [...stock.history];
        const lastCandle = { ...newHistory[newHistory.length - 1] };
        
        lastCandle.close = newPrice;
        if (newPrice > lastCandle.high) lastCandle.high = newPrice;
        if (newPrice < lastCandle.low) lastCandle.low = newPrice;
        lastCandle.volume += Math.floor(Math.random() * 1500) + 100;
        
        newHistory[newHistory.length - 1] = lastCandle;

        // Fluctuating level 2 slightly
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
      });
    }, 400);

    return () => clearInterval(interval);
  }, [stocks]);

  // Simulated News Generator
  useEffect(() => {
    const mockNewsFlash = [
      { text: '[MACRO] HOUSING PERMITS RISE 1.2% IN MAY', type: 'NORMAL' },
      { text: 'SEC INVESTIGATES UNUSUAL CALL VOLUME IN TSLA', type: 'ALERT' },
      { text: 'NVDA ANNOUNCES NEW GEFORCE RTX ARCHITECTURE', type: 'NORMAL' },
      { text: '[URGENT] GEOPOLITICAL TENSIONS ESCALATE IN MIDDLE EAST', type: 'URGENT' },
      { text: 'MSFT SURFACE OUTLOOK UPGRADED BY MORGAN STANLEY', type: 'NORMAL' },
      { text: 'COINBASE REPORTED OUTAGE AMID BTC VOLATILITY', type: 'ALERT' },
      { text: 'APPLE UNVEILS M4 ULTRA CHIP AT DEVELOPER FORUM', type: 'NORMAL' },
    ];

    const interval = setInterval(() => {
      const selected = mockNewsFlash[Math.floor(Math.random() * mockNewsFlash.length)];
      const d = new Date();
      const newsTime = d.toLocaleTimeString([], { hour12: false });
      
      setNews((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          time: newsTime,
          text: selected.text,
          type: selected.type as any,
        },
      ]);
    }, 15000); // news every 15s

    return () => clearInterval(interval);
  }, []);

  // Drawing the Candlestick Canvas Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const activeStock = stocks[activeSymbol];
    if (!activeStock || !activeStock.history) return;

    const candles = activeStock.history;

    // Resize canvas based on client rect
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;

    // Clear chart
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Padding settings
    const paddingRight = 55;
    const paddingBottom = 25;
    const chartWidth = width - paddingRight;
    const chartHeight = height - paddingBottom;

    // Draw Grid Lines
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;

    // Vertical grid lines
    const gridCols = 8;
    for (let i = 0; i <= gridCols; i++) {
      const x = (chartWidth / gridCols) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, chartHeight);
      ctx.stroke();
    }

    // Horizontal grid lines
    const gridRows = 6;
    for (let i = 0; i <= gridRows; i++) {
      const y = (chartHeight / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();
    }

    // Compute Min / Max Prices & Volume
    const prices = candles.flatMap((c) => [c.low, c.high]);
    const minPrice = Math.min(...prices) * 0.9995;
    const maxPrice = Math.max(...prices) * 1.0005;
    const priceDiff = maxPrice - minPrice;

    const volumes = candles.map((c) => c.volume);
    const maxVolume = Math.max(...volumes);

    // Draw Price Labels on Y-axis (Right margin)
    ctx.fillStyle = '#886600';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridRows; i++) {
      const priceVal = maxPrice - (priceDiff / gridRows) * i;
      const y = (chartHeight / gridRows) * i;
      ctx.fillText(priceVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), width - 5, y);
    }

    // Draw Time Labels on X-axis (Bottom margin)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const timeStep = Math.floor(candles.length / 4);
    for (let i = 0; i < candles.length; i += timeStep) {
      const x = (chartWidth / (candles.length - 1)) * i;
      const timeText = candles[i].time.substring(0, 5); // display HH:MM
      ctx.fillText(timeText, x, chartHeight + 5);
    }

    // Draw Candlesticks & Volume
    const candleWidth = (chartWidth / candles.length) * 0.7;
    
    candles.forEach((candle, idx) => {
      const x = (chartWidth / (candles.length - 1)) * idx;
      
      const openY = chartHeight - ((candle.open - minPrice) / priceDiff) * chartHeight;
      const closeY = chartHeight - ((candle.close - minPrice) / priceDiff) * chartHeight;
      const highY = chartHeight - ((candle.high - minPrice) / priceDiff) * chartHeight;
      const lowY = chartHeight - ((candle.low - minPrice) / priceDiff) * chartHeight;

      const isGreen = candle.close >= candle.open;
      const color = isGreen ? '#00FF00' : '#FF0000';

      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      // Draw wick
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      const rectY = Math.min(openY, closeY);
      const rectHeight = Math.max(1, Math.abs(openY - closeY));
      ctx.fillRect(x - candleWidth / 2, rectY, candleWidth, rectHeight);

      // Volume bar drawing in background / lower section
      const volHeight = (candle.volume / maxVolume) * (chartHeight * 0.15);
      ctx.fillStyle = isGreen ? 'rgba(0, 255, 0, 0.15)' : 'rgba(255, 0, 0, 0.15)';
      ctx.fillRect(x - candleWidth / 2, chartHeight - volHeight, candleWidth, volHeight);
    });

  }, [stocks, activeSymbol]);

  // Interactive Command Prompt Parser
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCmd = command.trim().toUpperCase();
    if (!cleanCmd) return;

    if (INITIAL_STOCKS[cleanCmd]) {
      setActiveSymbol(cleanCmd);
      setCommandFeedback(`LOADING TICKER: ${cleanCmd}`);
    } else if (cleanCmd === 'HELP') {
      setCommandFeedback('COMMANDS: AAPL, MSFT, TSLA, NVDA, BTC, BUY, SELL, HELP, CLEAR');
      setNews((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          time: sysTime,
          text: '[SYSTEM] AVAILABLE CMD: <TICKER> (e.g. MSFT), BUY, SELL, CLEAR',
          type: 'NORMAL',
        },
      ]);
    } else if (cleanCmd === 'CLEAR') {
      setNews([]);
      setCommandFeedback('NEWS FEED CLEARED');
    } else if (cleanCmd === 'BUY' || cleanCmd === 'SELL') {
      setOrderAction(cleanCmd as any);
      setCommandFeedback(`ORDER TYPE CHANGED TO: ${cleanCmd}`);
    } else {
      setCommandFeedback(`INVALID COMMAND: ${cleanCmd}. TYPE 'HELP'`);
    }

    setCommand('');
  };

  const handleOrderSubmit = () => {
    const stock = stocks[activeSymbol];
    if (!stock) return;

    const estValue = quantity * stock.price;
    const timeStr = new Date().toLocaleTimeString([], { hour12: false });
    
    // Add to alert toast notifications
    const newAlert = {
      id: Math.random().toString(),
      text: `EXECUTED: ${orderAction} ${quantity} ${activeSymbol} @ $${stock.price} (VAL: $${estValue.toLocaleString(undefined, { minimumFractionDigits: 2 })})`,
    };
    
    setNotifications((prev) => [...prev, newAlert]);
    
    // Automatically fade out notification
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newAlert.id));
    }, 4500);

    // Also append transaction to live news feed
    setNews((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        time: timeStr,
        text: `[TRADE] INDIVIDUAL ACCOUNT ${orderAction}S ${quantity} SHARES OF ${activeSymbol}`,
        type: 'ALERT',
      },
    ]);
  };

  const activeStock = stocks[activeSymbol];

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden bg-black text-[#ff9900]">
      {/* Top App Bar */}
      <header className="h-10 bg-black border-b border-grid-line flex justify-between items-center px-4 z-50">
        <div className="flex items-center gap-6">
          <span className="text-headline-lg font-bold text-[#ff9900]">TERMINAL_V1.0</span>
          <nav className="hidden md:flex items-center gap-4 text-label-caps">
            <span className="bg-[#ff9900] text-black font-bold px-2 py-0.5">GLOBAL_MARKETS</span>
            <span className="text-[#d5ac4a] hover:bg-surface-container-highest cursor-pointer px-2 py-0.5 transition-all">STREAMS</span>
            <span className="text-[#d5ac4a] hover:bg-surface-container-highest cursor-pointer px-2 py-0.5 transition-all">LIT_POOLS</span>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[#ff9900]">
          <span className="text-label-caps text-muted-bronze hidden sm:inline">CONN: PROD-NY-4</span>
          <button className="hover:bg-surface-container-highest p-1"><span className="material-symbols-outlined text-[18px]">settings</span></button>
          <button className="hover:bg-surface-container-highest p-1"><span className="material-symbols-outlined text-[18px]">help</span></button>
          <button className="hover:bg-surface-container-highest p-1"><span className="material-symbols-outlined text-[18px]">power_settings_new</span></button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Side Bar */}
        <aside className="w-48 bg-[#050505] border-r border-grid-line flex flex-col justify-between hidden md:flex">
          <div className="flex flex-col">
            <div className="p-3 border-b border-grid-line">
              <div className="text-headline-md text-[#ff9900]">SYS_STATUS</div>
              <div className="text-[10px] text-[#886600] mt-1 uppercase">FED RESERVE FEED: OK</div>
            </div>
            <nav className="flex flex-col mt-2">
              {Object.keys(INITIAL_STOCKS).map((sym) => (
                <button
                  key={sym}
                  onClick={() => setActiveSymbol(sym)}
                  className={`px-4 py-2 text-left text-label-caps flex justify-between items-center transition-all ${
                    activeSymbol === sym
                      ? 'bg-[#ff9900] text-black border-l-4 border-yellow-600 font-bold'
                      : 'text-[#a38d7a] hover:bg-[#1f1f1f] hover:text-[#ff9900]'
                  }`}
                >
                  <span>{sym}</span>
                  {stocks[sym] && (
                    <span className={`text-[10px] ${
                      activeSymbol === sym 
                        ? 'text-black' 
                        : (stocks[sym].price >= stocks[sym].prevClose ? 'text-[#00ff00]' : 'text-[#ff0000]')
                    }`}>
                      {stocks[sym].price.toFixed(1)}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-3 border-t border-grid-line">
            <div className="text-[10px] text-[#886600]">API HOST: CLOUD_NET</div>
            <div className="text-[10px] text-white">LATENCY: 4.2ms</div>
          </div>
        </aside>

        {/* 3-Column Core Grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[#333333] overflow-hidden">
          {/* Column 1: Live News (col-span-3) */}
          <section className="lg:col-span-3 bg-black flex flex-col h-full overflow-hidden">
            <header className="panel-header flex justify-between items-center bg-[#0e0e0e]">
              <span className="text-headline-md text-[#886600]">LIVE_NEWS_FEED</span>
              <span className="text-label-caps text-[#886600]">{sysTime}</span>
            </header>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {news.slice().reverse().map((item) => (
                <div key={item.id} className="border-b border-[#222] pb-2 text-body-default">
                  <div className="flex justify-between items-center mb-1 text-[11px] text-[#886600]">
                    <span>{item.time}</span>
                    {item.type === 'URGENT' && (
                      <span className="bg-red-950 text-red-500 border border-red-700 px-1 text-[10px] font-bold">URGENT</span>
                    )}
                    {item.type === 'ALERT' && (
                      <span className="bg-[#2a1b00] text-[#ff9900] border border-[#886600] px-1 text-[10px] font-bold">TRADE</span>
                    )}
                  </div>
                  <p className="text-[#e2e2e2] leading-tight font-mono">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Column 2: Chart Area (col-span-6) */}
          <section className="lg:col-span-6 bg-black flex flex-col h-full overflow-hidden">
            <header className="bg-[#ff9900] text-black p-2 flex justify-between items-center">
              <span className="text-headline-md font-bold">{activeSymbol} - PRICE ACTION</span>
              {activeStock && (
                <div className="flex gap-3 text-label-caps font-mono font-bold text-[12px]">
                  <span>O: {activeStock.history[activeStock.history.length - 1]?.open.toFixed(2)}</span>
                  <span>H: {activeStock.history[activeStock.history.length - 1]?.high.toFixed(2)}</span>
                  <span>L: {activeStock.history[activeStock.history.length - 1]?.low.toFixed(2)}</span>
                  <span className="bg-black text-[#00ff00] px-1 ml-1">
                    C: {activeStock.price.toFixed(2)}
                  </span>
                </div>
              )}
            </header>
            <div className="flex-1 flex flex-col p-4 relative overflow-hidden">
              {/* Canvas Candlestick Chart */}
              <div className="flex-1 relative border border-grid-line">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </div>
          </section>

          {/* Column 3: Order Execution (col-span-3) */}
          <section className="lg:col-span-3 bg-black flex flex-col h-full overflow-hidden">
            <header className="panel-header bg-[#0e0e0e]">
              <span className="text-headline-md text-[#886600]">ORDER_EXECUTION</span>
            </header>
            <div className="p-3 flex flex-col gap-4 flex-1 overflow-y-auto">
              {/* Instrument stats block */}
              {activeStock && (
                <div className="border border-[#886600] p-2 bg-[#050505]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-headline-lg font-bold text-[#ff9900]">{activeSymbol}</span>
                    <span className={`text-headline-md ${
                      activeStock.price >= activeStock.prevClose ? 'text-[#00ff00]' : 'text-[#ff0000]'
                    }`}>
                      {activeStock.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-bronze flex justify-between">
                    <span>NAME: {activeStock.name}</span>
                  </div>
                </div>
              )}

              {/* Order Book Grid (Level 2 data) */}
              <div className="flex-1 min-h-[140px] flex flex-col border border-grid-line bg-[#040404]">
                <div className="grid grid-cols-2 text-center border-b border-grid-line bg-[#111]">
                  <div className="p-1 text-label-caps text-[#886600] border-r border-grid-line">BID SIZE</div>
                  <div className="p-1 text-label-caps text-[#886600]">ASK SIZE</div>
                </div>
                <div className="flex-1 overflow-y-auto text-[12px] font-mono">
                  {activeStock?.level2.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 border-b border-[#222] py-0.5">
                      <div className="border-r border-grid-line flex justify-between px-2 text-[#00ff00]">
                        <span>{(row.bidPrice).toFixed(2)}</span>
                        <span className="opacity-70">{row.bidSize}</span>
                      </div>
                      <div className="flex justify-between px-2 text-[#ff0000]">
                        <span>{(row.askPrice).toFixed(2)}</span>
                        <span className="opacity-70">{row.askSize}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order input controls */}
              <div className="space-y-3 mt-auto">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderAction('BUY')}
                    className={`py-2 text-headline-md font-bold transition-all border ${
                      orderAction === 'BUY'
                        ? 'bg-[#00ff00] text-black border-[#00ff00]'
                        : 'bg-transparent text-[#00ff00] border-[#00ff00] hover:bg-[#00ff00]/10'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => setOrderAction('SELL')}
                    className={`py-2 text-headline-md font-bold transition-all border ${
                      orderAction === 'SELL'
                        ? 'bg-[#ff0000] text-black border-[#ff0000]'
                        : 'bg-transparent text-[#ff0000] border-[#ff0000] hover:bg-[#ff0000]/10'
                    }`}
                  >
                    SELL
                  </button>
                </div>

                <div>
                  <label className="text-label-caps text-muted-bronze block mb-1">QUANTITY</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-black border border-[#886600] text-[#ff9900] p-2 focus:outline-none focus:border-[#ff9900] text-right font-mono"
                  />
                </div>

                <div>
                  <label className="text-label-caps text-muted-bronze block mb-1">ORDER TYPE</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-black border border-[#886600] text-[#ff9900] p-2 focus:outline-none focus:border-[#ff9900] font-mono"
                  >
                    <option value="MARKET">MARKET</option>
                    <option value="LIMIT">LIMIT</option>
                    <option value="STOP">STOP</option>
                  </select>
                </div>

                <div className="border-t border-[#333] pt-2 flex justify-between text-body-tabular">
                  <span className="text-[#886600]">EST. VALUE:</span>
                  <span className="font-bold text-white">
                    ${activeStock ? (quantity * activeStock.price).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                  </span>
                </div>

                <button
                  onClick={handleOrderSubmit}
                  className="w-full bg-[#ff9900] text-black font-bold py-3 hover:bg-[#ff9900]/95 transition-all text-headline-md"
                >
                  SUBMIT ORDER
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Notifications */}
      <div className="fixed bottom-14 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-[#0e0e0e] border border-[#ff9900] p-3 text-[12px] font-mono text-[#ff9900] shadow-lg animate-pulse"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold uppercase text-[10px] text-[#886600]">SYSTEM TRANSACTION LOG</span>
              <button
                onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
                className="hover:text-white ml-2"
              >
                ✕
              </button>
            </div>
            {n.text}
          </div>
        ))}
      </div>

      {/* Terminal CMD Prompt Footer */}
      <footer className="h-12 bg-[#0e0e0e] border-t border-[#ff9900] flex items-center px-4 gap-4 z-50">
        <span className="text-label-caps text-[#ff9900] shrink-0">{commandFeedback}</span>
        <div className="flex gap-3 text-label-caps text-[#886600] hidden lg:flex">
          <span className="cursor-pointer hover:text-[#ff9900]">_EXECUTE</span>
          <span className="cursor-pointer hover:text-[#ff9900]">_HISTORY</span>
          <span className="cursor-pointer hover:text-[#ff9900]">_STATUS</span>
        </div>
        <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center bg-black border border-[#886600] h-8 px-2 focus-within:border-[#ff9900]">
          <span className="text-[#ff9900] mr-2">&gt;</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="bg-transparent border-none outline-none text-[#ff9900] w-full font-mono text-[14px] focus:ring-0 p-0"
            placeholder="ENTER TICKER OR CMD (e.g. MSFT, HELP)"
            autoFocus
          />
          <span className="blinking-cursor w-2 h-4 bg-[#ff9900] inline-block ml-1"></span>
        </form>
      </footer>
    </div>
  );
}
