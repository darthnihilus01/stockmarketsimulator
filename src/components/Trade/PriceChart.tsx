'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { buildChartOptions } from '@/services/echartsOptions';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y', 'MAX'] as const;

export function PriceChart() {
  const stocks = useStore((s) => s.stocks);
  const selectedTicker = useStore((s) => s.selectedTicker);
  const chartType = useStore((s) => s.chartType);
  const timeframe = useStore((s) => s.timeframe);
  const setChartType = useStore((s) => s.setChartType);
  const setTimeframe = useStore((s) => s.setTimeframe);

  const chartRef = useRef<ReactECharts | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStock = selectedTicker ? stocks[selectedTicker] : undefined;

  const slicedHistory = useMemo(() => {
    if (!activeStock?.history) return [];
    const h = activeStock.history;
    switch (timeframe) {
      case '1D': return h;
      case '1W': return h;
      case '1M': return h;
      default: return h;
    }
  }, [activeStock?.history, timeframe]);

  const options = useMemo(
    () => buildChartOptions(slicedHistory, chartType, timeframe),
    [slicedHistory, chartType, timeframe],
  );

  const onChartReady = useCallback(() => {
    if (chartRef.current) {
      const instance = chartRef.current.getEchartsInstance();
      instance?.resize();
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (chartRef.current) {
        const instance = chartRef.current.getEchartsInstance();
        instance?.resize();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !activeStock?.history) return;
    const instance = chartRef.current.getEchartsInstance();
    if (!instance) return;

    const newOpts = buildChartOptions(slicedHistory, chartType, timeframe);
    instance.setOption(newOpts, { notMerge: false, lazyUpdate: true });
  }, [stocks, selectedTicker, activeStock]);

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
      <div ref={containerRef} className="flex-1 min-h-0">
        <ReactECharts
          ref={chartRef}
          option={options}
          style={{ height: '100%', width: '100%' }}
          onChartReady={onChartReady}
          notMerge
          lazyUpdate
        />
      </div>
    </motion.div>
  );
}
