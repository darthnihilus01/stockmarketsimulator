'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function PortfolioChart() {
  const portfolio = useStore((s) => s.portfolio);

  const data = useMemo(() => {
    if (portfolio.valueHistory.length === 0) {
      return [{ time: 'START', portfolio: portfolio.startingCapital, market: portfolio.startingCapital }];
    }
    return portfolio.valueHistory.slice(-100);
  }, [portfolio.valueHistory, portfolio.startingCapital]);

  if (portfolio.valueHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-grid-line bg-[#050505] flex flex-col flex-1 mt-[1px]"
      >
        <div className="panel-header bg-[#0e0e0e]">
          <span className="text-headline-md text-[#886600]">EQUITY VALUE</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-[#886600] p-8">
          MAKE A TRADE TO START TRACKING
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-grid-line bg-[#050505] flex flex-col flex-1 mt-[1px]"
    >
      <div className="panel-header bg-[#0e0e0e]">
        <span className="text-headline-md text-[#886600]">EQUITY VALUE</span>
      </div>
      <div className="flex-1 p-4" style={{ minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#886600', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#333' }}
            />
            <YAxis
              tick={{ fill: '#886600', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: '#333' }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#0e0e0e',
                border: '1px solid #886600',
                borderRadius: 0,
                fontFamily: 'monospace',
                fontSize: 12,
              }}
              labelStyle={{ color: '#886600' }}
              formatter={(value) => { const v = Number(value); return [`$${v.toLocaleString(undefined, { minimumFractionDigits: 2 })}`]; }}
            />
            <Legend
              wrapperStyle={{ fontFamily: 'monospace', fontSize: 12, color: '#e2e2e2' }}
            />
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke="#ff9900"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#ff9900' }}
              name="Portfolio"
            />
            <Line
              type="monotone"
              dataKey="market"
              stroke="#ff0000"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#ff0000' }}
              name="Market Index"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
