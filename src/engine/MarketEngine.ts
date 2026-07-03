import { STOCK_DEFINITIONS } from './seed/stocks';
import { FACTOR_IDS } from './seed/factors';
import { computeFactorReturns } from './FactorEngine';
import { maybeGenerateHeadline, createContributionsFromHeadline, decayHeadlines, getHeadlineNewsItem } from './NewsEngine';
import { computeFairValueReturn, computePartialPermanence, computeMeanReversionTarget } from './FairValueEngine';
import { SimulationClock } from './SimulationClock';
import { normalRandom, clamp } from './MathUtils';
import type { HeadlineMeta, FactorContribution, MarketState, StockData, Candle, NewsItem, TickData } from '@/types';

const MEAN_REVERSION_STRENGTH = 0.001;
const NOISE_SIGMA = 0.0015;
const HEADLINE_PROBABILITY = 0.04;
const HEADLINE_COOLDOWN_TICKS = 20;
const BASE_MARKET_RETURN = 0.00002;
const INITIAL_HISTORY_BARS = 40;

function formatTime(tick: number): string {
  const totalSeconds = Math.floor(tick * 0.4);
  const h = Math.floor(totalSeconds / 3600) % 24;
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export class MarketEngine {
  private clock: SimulationClock;
  private stocks: Map<string, StockData>;
  private factorStrengths: Record<string, number>;
  private activeContributions: FactorContribution[] = [];
  private marketReturn = 0;
  private lastHeadlineTick = -100;
  private headlines: HeadlineMeta[] = [];
  private newsItems: NewsItem[] = [];
  private previousStockReturns: Record<string, number> = {};
  private callback: ((data: {
    stocks: StockData[];
    news: NewsItem[];
    marketState: MarketState;
    tick: number;
    tickData: TickData[];
  }) => void) | null = null;

  constructor() {
    this.clock = new SimulationClock(400);
    this.stocks = new Map();
    this.factorStrengths = {};
    this.headlines = [];
    this.newsItems = [];

    FACTOR_IDS.forEach((id) => {
      this.factorStrengths[id] = 0;
    });

    const initialReturn = 0;

    for (const def of STOCK_DEFINITIONS) {
      this.previousStockReturns[def.symbol] = initialReturn;

      const history: Candle[] = [];
      let price = def.basePrice;
      for (let i = 0; i < INITIAL_HISTORY_BARS; i++) {
        const r = normalRandom() * NOISE_SIGMA;
        const open = price;
        price = price * Math.exp(r);
        const hi = Math.max(open, price) * (1 + Math.abs(normalRandom()) * 0.002);
        const lo = Math.min(open, price) * (1 - Math.abs(normalRandom()) * 0.002);
        history.push({
          time: formatTime(i),
          open,
          high: hi,
          low: lo,
          close: price,
          volume: Math.floor(100000 + Math.abs(normalRandom()) * 500000),
        });
      }

      const h = history[history.length - 1];
      this.stocks.set(def.symbol, {
        symbol: def.symbol,
        name: def.name,
        price,
        prevClose: h?.close ?? price,
        bid: price * 0.999,
        ask: price * 1.001,
        bidSize: Math.floor(Math.random() * 10000),
        askSize: Math.floor(Math.random() * 10000),
        history,
        level2: [],
        sector: def.sector,
        research: def.research,
      });
    }
  }

  getTick() {
    return this.clock.tick;
  }

  getStocks(): StockData[] {
    return Array.from(this.stocks.values());
  }

  getStock(symbol: string): StockData | undefined {
    return this.stocks.get(symbol);
  }

  getMarketState(): MarketState {
    return {
      tick: this.clock.tick,
      factorStrengths: { ...this.factorStrengths },
      activeContributions: [...this.activeContributions],
      marketReturn: this.marketReturn,
    };
  }

  getHeadlines(): HeadlineMeta[] {
    return this.headlines;
  }

  getNewsItems(): NewsItem[] {
    return this.newsItems;
  }

  onTick(cb: MarketEngine['callback']) {
    this.callback = cb;
  }

  tick(): void {
    this.clock.increment();
    const tick = this.clock.tick;

    this.activeContributions = decayHeadlines(this.activeContributions, tick);

    const {
      newStrengths,
      innovation,
    } = computeFactorReturns(this.factorStrengths, this.activeContributions, tick);
    this.factorStrengths = newStrengths;
    this.marketReturn = BASE_MARKET_RETURN + innovation;

    const hl = maybeGenerateHeadline(tick, this.lastHeadlineTick, HEADLINE_COOLDOWN_TICKS, HEADLINE_PROBABILITY);
    if (hl) {
      this.lastHeadlineTick = tick;
      this.headlines.push(hl);
      const contributions = createContributionsFromHeadline(hl);
      this.activeContributions.push(...contributions);
      const newsItem = getHeadlineNewsItem(hl, tick);
      this.newsItems = [newsItem, ...this.newsItems].slice(0, 100);
    }

    const tickData: TickData[] = [];
    const existingStocks = new Map(this.stocks);

    for (const def of STOCK_DEFINITIONS) {
      const existing = existingStocks.get(def.symbol);
      if (!existing) continue;

      const { fairValueReturn, factorImpact, marketImpact } = computeFairValueReturn(
        def,
        this.factorStrengths,
        this.marketReturn,
      );

      const partialPermanence = computePartialPermanence(
        this.previousStockReturns[def.symbol] ?? fairValueReturn,
      );

      const meanReversion = computeMeanReversionTarget(
        existing.price,
        def.basePrice,
        MEAN_REVERSION_STRENGTH,
      );

      const drift = def.drift;

      const noise = normalRandom() * NOISE_SIGMA;

      const totalReturn = drift + fairValueReturn + partialPermanence + meanReversion + noise;

      const open = existing.price;
      let close = existing.price * Math.exp(clamp(totalReturn, -0.08, 0.08));

      if (close <= 0) close = existing.price * 0.99;

      const hi = Math.max(open, close) * (1 + Math.abs(normalRandom()) * 0.003);
      const lo = Math.min(open, close) * (1 - Math.abs(normalRandom()) * 0.003);
      const volume = Math.floor(100000 + Math.abs(normalRandom()) * 500000);

      this.previousStockReturns[def.symbol] = totalReturn;

      const prevClose = existing.history.length > 0
        ? existing.history[existing.history.length - 1].close
        : close;

      const candle: Candle = {
        time: formatTime(tick),
        open,
        high: hi,
        low: lo,
        close,
        volume,
      };

      const history = [...existing.history, candle].slice(-250);

      const bid = close * (0.998 + Math.random() * 0.002);
      const ask = close * (1.001 - Math.random() * 0.001);

      this.stocks.set(def.symbol, {
        ...existing,
        price: close,
        prevClose,
        bid,
        ask,
        bidSize: Math.floor(Math.random() * 10000),
        askSize: Math.floor(Math.random() * 10000),
        history,
      });

      tickData.push({
        time: tick,
        symbol: def.symbol,
        open,
        high: hi,
        low: lo,
        close,
        volume,
        return: totalReturn,
      });
    }

    if (this.headlines.length > 200) {
      this.headlines = this.headlines.slice(-200);
    }
    if (this.newsItems.length > 100) {
      this.newsItems = this.newsItems.slice(0, 100);
    }

    if (this.callback) {
      this.callback({
        stocks: this.getStocks(),
        news: this.newsItems,
        marketState: this.getMarketState(),
        tick,
        tickData,
      });
    }
  }

  start(): void {
    this.clock.start();
  }

  stop(): void {
    this.clock.stop();
  }

  reset(): void {
    this.clock.reset();
    this.stocks.clear();
    this.factorStrengths = {};
    this.activeContributions = [];
    this.headlines = [];
    this.newsItems = [];
    this.lastHeadlineTick = -100;
    this.previousStockReturns = {};
    this.marketReturn = 0;
  }
}
