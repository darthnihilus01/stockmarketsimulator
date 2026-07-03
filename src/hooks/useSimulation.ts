'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { SimulationEngine } from '@/engine/SimulationEngine';

export function useSimulation() {
  const applySnapshot = useStore((s) => s.applySnapshot);
  const engineRef = useRef<SimulationEngine | null>(null);

  useEffect(() => {
    const engine = new SimulationEngine(Date.now());
    engineRef.current = engine;

    engine.onSnapshot((snapshot) => {
      applySnapshot({
        stocks: snapshot.stocks,
        news: snapshot.news,
        marketState: snapshot.marketState,
        tick: snapshot.tick,
      });
    });

    engine.start(400);

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [applySnapshot]);
}
