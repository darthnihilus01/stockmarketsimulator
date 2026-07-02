'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function usePrices() {
  const tickPrices = useStore((s) => s.tickPrices);
  const stocks = useStore((s) => s.stocks);

  useEffect(() => {
    if (Object.keys(stocks).length === 0) return;
    const interval = setInterval(tickPrices, 400);
    return () => clearInterval(interval);
  }, [tickPrices, stocks]);
}
