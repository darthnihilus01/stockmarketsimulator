'use client';

import { usePortfolio } from '@/hooks/usePortfolio';
import { MetricCard } from './MetricCard';
import { MetricSkeleton } from '@/components/shared/LoadingSkeleton';

export function MetricGrid() {
  const { metrics, portfolio } = usePortfolio();

  if (!portfolio) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#333]">
      {Array.from({ length: 6 }).map((_, i) => (
        <MetricSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#333]">
      {metrics.map((metric, idx) => (
        <MetricCard key={metric.label} data={metric} index={idx} />
      ))}
    </div>
  );
}
