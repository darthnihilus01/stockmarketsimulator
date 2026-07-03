'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { buildChartOptions } from '@/services/echartsOptions';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y', 'MAX'] as const;

export function PriceChart() {
  const activeStock = useStore((s) => (s.selectedTicker ? s.stocks[s.selectedTicker] : undefined));
  const chartType = useStore((s) => s.chartType);
  const timeframe = useStore((s) => s.timeframe);
  const setChartType = useStore((s) => s.setChartType);
  const setTimeframe = useStore((s) => s.setTimeframe);

  const chartRef = useRef<ReactECharts>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () => buildChartOptions(activeStock?.history ?? [], chartType, timeframe),
    [activeStock?.history, chartType, timeframe],
  );

  const resize = useCallback(() => {
    try { chartRef.current?.getEchartsInstance()?.resize(); } catch {}
  }, []);

  const onChartReady = useCallback(() => {
    setTimeout(resize, 0);
  }, [resize]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [resize]);

  useEffect(() => {
    setTimeout(resize, 50);
  }, [options, resize]);

  if (!activeStock) {
    return (
      <div className="border border-grid-line bg-[#050505] flex flex-col flex-1">
        <div className="panel-header bg-[#0e0e0e]">
          <span className="text-headline-md text-[#886600]">PRICE ACTION</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-[#886600]">SELECT A TICKER</div>
      </div>
    );
  }

  const change = activeStock.price - activeStock.prevClose;
  const changePercent = (change / activeStock.prevClose) * 100;
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-grid-line bg-[#050505] flex flex-col flex-1"
    >
      <div className="panel-header bg-[#0e0e0e] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-headline-md text-[#886600]">PRICE ACTION</span>
          <span className="text-headline-lg font-bold text-[#ff9900]">{activeStock.symbol}</span>
          <span className={`text-headline-md ${isPositive ? 'text-[#00ff00]' : 'text-[#ff0000]'}`}>
            ${activeStock.price.toFixed(2)}
          </span>
          <span className={`text-[12px] ${isPositive ? 'text-[#00ff00]' : 'text-[#ff0000]'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-1.5 py-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#9E9E9E] hover:bg-[#2B2B2B]'
                }`}
                aria-label={`${tf} timeframe`}
                aria-pressed={timeframe === tf}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-[#2B2B2B] mx-1" />
          <div className="flex gap-0.5">
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`px-1.5 py-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                chartType === 'line'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#9E9E9E] hover:bg-[#2B2B2B]'
              }`}
              aria-label="Line chart"
              aria-pressed={chartType === 'line'}
            >
              LINE
            </button>
            <button
              type="button"
              onClick={() => setChartType('candlestick')}
              className={`px-1.5 py-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                chartType === 'candlestick'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#9E9E9E] hover:bg-[#2B2B2B]'
              }`}
              aria-label="Candlestick chart"
              aria-pressed={chartType === 'candlestick'}
            >
              CANDLE
            </button>
          </div>
        </div>
      </div>
      <div ref={wrapperRef} className="flex-1 min-h-0 relative">
        <ReactECharts
          ref={chartRef}
          option={options}
          onChartReady={onChartReady}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          notMerge={false}
          lazyUpdate
        />
      </div>
    </motion.div>
  );
}
