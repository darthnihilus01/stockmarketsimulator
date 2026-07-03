// spec: 4.8 — Full Tick Pipeline
// 1. Fire scheduled events → 2. Generate event scores → 3. Compute all event decays
// → 4. Aggregate factor shocks → 5. Aggregate ticker shocks → 6. Generate correlated factor returns
// → 7. Generate market return → 8. For every stock: compute news, update fair value,
//    compute mean reversion, generate noise, compute return, update price, append history

import { FACTOR_IDS } from './seed/factors';
import { STOCK_DEFINITIONS } from './seed/stocks';
import { initializeFactorEngine, computeFactorReturns } from './FactorEngine';
import { generateMarketReturn } from './MarketEngine';
import {
  type HeadlineEvent,
  maybeGenerateHeadline,
  aggregateFactorNews,
  cleanupEvents,
} from './NewsEngine';
import { computeStockReturn, updatePrice, type StockState } from './PriceEngine';
import { initializeFairValue } from './FairValueEngine';
import { setGlobalSeed, getGlobalRng } from './math/Random';
import { INITIAL_HISTORY_BARS, BETA_MARKET_MEAN, BETA_MARKET_STD, FACTOR_BETA_MEAN, FACTOR_BETA_STD, SIGMA_IDIO_BASE } from './constants';
import type { Candle, StockData, MarketState, NewsItem, TickData, NewsType } from '@/types';

function formatTime(tick: number): string {
  if (tick < 0) return `T${tick}`;
  const totalSeconds = Math.floor(tick * 0.4);
  const h = Math.floor(totalSeconds / 3600) % 24;
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export interface SimulationSnapshot {
  stocks: StockData[];
  news: NewsItem[];
  marketState: MarketState;
  tick: number;
  tickData: TickData[];
}

export class SimulationEngine {
  private tickCounter = 0;
  private stockStates: Map<string, StockState> = new Map();
  private stockDatas: Map<string, StockData> = new Map();
  private marketReturn = 0;
  private lastHeadlineTick = -100;
  private headlineEvents: HeadlineEvent[] = [];
  private lastFactorReturns: number[] = [];
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private callback: ((snapshot: SimulationSnapshot) => void) | null = null;

  constructor(seed?: number) {
    if (seed !== undefined) {
      setGlobalSeed(seed);
    }
    this.initialize();
  }

  private initialize(): void {
    const rng = getGlobalRng();

    initializeFactorEngine();
    initializeFairValue(STOCK_DEFINITIONS);
    this.lastFactorReturns = new Array(FACTOR_IDS.length).fill(0);

    for (const def of STOCK_DEFINITIONS) {
      // spec: 4.12 — Randomize once per game: Market Beta, Factor Betas
      const betaMarket = Math.max(
        0.1,
        rng.nextNormal() * BETA_MARKET_STD + BETA_MARKET_MEAN,
      );

      const factorBetas: number[] = FACTOR_IDS.map(() => {
        return rng.nextNormal() * FACTOR_BETA_STD + FACTOR_BETA_MEAN;
      });

      // spec: 4.7.1 — σ_idio(i) drawn once per game
      const sigmaIdio = Math.max(0.001, rng.nextNormal() * 0.004 + SIGMA_IDIO_BASE);

      const stockState: StockState = {
        symbol: def.symbol,
        betaMarket,
        factorBetas,
        sigmaIdio,
        price: def.basePrice,
      };
      this.stockStates.set(def.symbol, stockState);

      // Generate initial history
      const history: Candle[] = [];
      let price = def.basePrice;

      for (let i = 0; i < INITIAL_HISTORY_BARS; i++) {
        const r = rng.nextNormal() * 0.002;
        const open = price;
        price = price * Math.exp(r);
        const hi = Math.max(open, price) * (1 + Math.abs(rng.nextNormal()) * 0.002);
        const lo = Math.min(open, price) * (1 - Math.abs(rng.nextNormal()) * 0.002);

        history.push({
          time: formatTime(i - INITIAL_HISTORY_BARS),
          open,
          high: hi,
          low: lo,
          close: price,
          volume: Math.floor(100000 + Math.abs(rng.nextNormal()) * 500000),
        });
      }

      const lastCandle = history[history.length - 1];
      const stockData: StockData = {
        symbol: def.symbol,
        name: def.name,
        price,
        prevClose: lastCandle?.close ?? price,
        bid: price * 0.999,
        ask: price * 1.001,
        bidSize: Math.floor(rng.next() * 10000),
        askSize: Math.floor(rng.next() * 10000),
        history,
        level2: [],
        sector: def.sector,
        research: def.research,
      };

      this.stockDatas.set(def.symbol, stockData);
    }
  }

  getStocks(): StockData[] {
    return Array.from(this.stockDatas.values());
  }

  getStock(symbol: string): StockData | undefined {
    return this.stockDatas.get(symbol);
  }

  getHeadlineEvents(): HeadlineEvent[] {
    return this.headlineEvents;
  }

  getTickCount(): number {
    return this.tickCounter;
  }

  // spec: 4.8 — Full Tick Pipeline
  tick(): void {
    const currentTick = this.tickCounter;

    // Step 1: Fire scheduled events
    const newEvent = maybeGenerateHeadline(currentTick, this.lastHeadlineTick);
    if (newEvent) {
      this.lastHeadlineTick = currentTick;
      this.headlineEvents.push(newEvent);
    }

    // Step 2: Generate event scores (done inside maybeGenerateHeadline)
    // Step 3: Compute all event decays (done inside computeShock / aggregateFactorNews)

    // Step 4: Aggregate factor shocks S(t)
    const factorNews = aggregateFactorNews(this.headlineEvents, currentTick);

    // Step 5: Aggregate ticker shocks (done per stock in computeStockReturn)

    // Step 6: Generate correlated factor returns F(t)
    // spec: 4.3 — F(t) = ν × (Lz) ⊙ σ_factor + S(t)
    const factorReturns = computeFactorReturns(factorNews);
    this.lastFactorReturns = factorReturns;

    // Step 7: Generate market return M(t)
    this.marketReturn = generateMarketReturn();

    // Step 8: For every stock
    const tickData: TickData[] = [];

    for (const def of STOCK_DEFINITIONS) {
      const stockState = this.stockStates.get(def.symbol);
      const stockData = this.stockDatas.get(def.symbol);
      if (!stockState || !stockData) continue;

      // spec: 4.8 step 8a — Compute news N(i,t)
      // spec: 4.8 step 8b — Update fair value A(i) (done inside computeStockReturn)
      // spec: 4.8 step 8c — Compute mean reversion R(i,t) (done inside computeStockReturn)
      // spec: 4.8 step 8d — Generate noise (done inside computeStockReturn)
      // spec: 4.8 step 8e — Compute return r(i,t)

      const { return: stockReturn } = computeStockReturn(
        stockState,
        this.marketReturn,
        factorReturns,
        this.headlineEvents,
        currentTick,
      );

      // spec: 4.8 step 8f — Update price P(i,t) = P(i,t-1) × exp(r(i,t))
      const open = stockState.price;
      const close = updatePrice(stockState.price, stockReturn);
      const high = Math.max(open, close) * (1 + Math.abs(getGlobalRng().nextNormal()) * 0.002);
      const low = Math.min(open, close) * (1 - Math.abs(getGlobalRng().nextNormal()) * 0.002);
      const volume = Math.floor(100000 + Math.abs(getGlobalRng().nextNormal()) * 500000);

      stockState.price = close;

      // spec: 4.8 step 8g — Append history
      const candle: Candle = {
        time: formatTime(currentTick),
        open,
        high,
        low,
        close,
        volume,
      };

      const history = [...stockData.history, candle].slice(-250);
      const prevClose = stockData.history.length > 0
        ? stockData.history[stockData.history.length - 1].close
        : close;

      this.stockDatas.set(def.symbol, {
        ...stockData,
        price: close,
        prevClose,
        bid: close * (0.998 + getGlobalRng().next() * 0.002),
        ask: close * (1.001 - getGlobalRng().next() * 0.001),
        bidSize: Math.floor(getGlobalRng().next() * 10000),
        askSize: Math.floor(getGlobalRng().next() * 10000),
        history,
      });

      tickData.push({
        time: currentTick,
        symbol: def.symbol,
        open,
        high,
        low,
        close,
        volume,
        return: stockReturn,
      });
    }

    // Clean expired events
    this.headlineEvents = cleanupEvents(this.headlineEvents, currentTick);

    // Cap headline event storage
    if (this.headlineEvents.length > 200) {
      this.headlineEvents = this.headlineEvents.slice(-200);
    }

    this.tickCounter++;

    if (this.callback) {
      this.callback(this.getSnapshot());
    }
  }

  private getSnapshot(): SimulationSnapshot {
    const factorStrengths: Record<string, number> = {};
    for (let i = 0; i < FACTOR_IDS.length; i++) {
      factorStrengths[FACTOR_IDS[i]] = this.lastFactorReturns[i] ?? 0;
    }

    const newsItems: NewsItem[] = this.headlineEvents
      .slice(-50)
      .reverse()
      .map((ev) => {
        const isUrgent = Math.abs(ev.actualScore) > 0.6;
        const type: NewsType = isUrgent ? 'URGENT' : Math.abs(ev.actualScore) > 0.3 ? 'ALERT' : 'NORMAL';
        return {
          id: ev.id,
          time: formatTime(ev.creationTick),
          text: ev.headline,
          type,
        };
      });

    return {
      stocks: this.getStocks(),
      news: newsItems,
      marketState: {
        tick: this.tickCounter,
        factorStrengths,
        activeContributions: [],
        marketReturn: this.marketReturn,
      },
      tick: this.tickCounter,
      tickData: [],
    };
  }

  onSnapshot(cb: (snapshot: SimulationSnapshot) => void): void {
    this.callback = cb;
  }

  start(intervalMs: number = 400): void {
    if (this.running) return;
    this.running = true;

    // Emit initial state immediately
    if (this.callback) {
      this.callback(this.getSnapshot());
    }

    this.intervalId = setInterval(() => {
      if (!this.running) return;
      this.tick();
    }, intervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(seed?: number): void {
    this.stop();
    this.tickCounter = 0;
    this.stockStates.clear();
    this.stockDatas.clear();
    this.headlineEvents = [];
    this.lastHeadlineTick = -100;
    this.lastFactorReturns = [];
    this.marketReturn = 0;

    if (seed !== undefined) {
      setGlobalSeed(seed);
    }
    this.initialize();
  }
}
