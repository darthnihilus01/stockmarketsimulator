'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export function useNews() {
  const addNews = useStore((s) => s.addNews);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(addNews, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [addNews]);
}
