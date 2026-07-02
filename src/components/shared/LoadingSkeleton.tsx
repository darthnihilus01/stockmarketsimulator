import { Skeleton } from '@/components/ui/skeleton';

export function ChartSkeleton() {
  return (
    <div className="flex-1 flex flex-col p-4">
      <Skeleton className="flex-1 w-full bg-[#1a1a1a]" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full bg-[#1a1a1a]" />
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="border border-[#333] bg-[#0a0a0a] p-4">
      <Skeleton className="h-3 w-24 bg-[#1a1a1a] mb-2" />
      <Skeleton className="h-6 w-32 bg-[#1a1a1a] mb-1" />
      <Skeleton className="h-3 w-16 bg-[#1a1a1a]" />
    </div>
  );
}
