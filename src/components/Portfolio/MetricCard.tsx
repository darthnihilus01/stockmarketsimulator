'use client';

import { motion } from 'framer-motion';
import type { MetricCardData } from '@/types';

interface MetricCardProps {
  data: MetricCardData;
  index: number;
}

export function MetricCard({ data, index }: MetricCardProps) {
  const isPositive = data.delta !== undefined && data.delta >= 0;
  const isNegative = data.delta !== undefined && data.delta < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="border border-grid-line bg-[#0a0a0a] p-4 flex flex-col gap-1"
    >
      <span className="text-label-caps text-[#886600]">{data.label}</span>
      <motion.span
        key={data.value}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-headline-lg font-bold text-[#ff9900]"
      >
        {data.value}
      </motion.span>
      {data.delta !== undefined && data.delta !== 0 && (
        <span
          className={`text-[11px] font-mono ${
            isPositive ? 'text-[#00ff00]' : isNegative ? 'text-[#ff0000]' : 'text-[#886600]'
          }`}
        >
          {isPositive ? '▲' : '▼'} {data.delta.toFixed(2)}{data.isPercentage ? '%' : ''}
          {data.deltaLabel ? ` ${data.deltaLabel}` : ''}
        </span>
      )}
    </motion.div>
  );
}
