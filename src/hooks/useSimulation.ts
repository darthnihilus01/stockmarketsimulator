'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export function useSimulation() {
  const engineTick = useStore((s) => s.engineTick);
  const tick = useStore((s) => s.tick);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(engineTick, 400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [engineTick]);
}
