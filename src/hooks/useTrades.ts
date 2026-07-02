'use client';

import { useCallback } from 'react';
import { useStore } from '@/store/useStore';

export function useTrades() {
  const submitOrder = useStore((s) => s.submitOrder);
  const clearOrder = useStore((s) => s.clearOrder);

  const execute = useCallback((): string | null => {
    return submitOrder();
  }, [submitOrder]);

  return { execute, clearOrder };
}
