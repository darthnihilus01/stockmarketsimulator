'use client';

import { useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function NewsFeed() {
  const news = useStore((s) => s.news);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearTop = useRef(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      isNearTop.current = el.scrollTop < 50;
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isNearTop.current && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [news.length]);

  return (
    <div className="border border-grid-line bg-[#050505] flex flex-col h-full overflow-hidden">
      <div className="panel-header bg-[#0e0e0e]">
        <span className="text-headline-md text-[#886600]">LIVE NEWS FEED</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
        role="log"
        aria-label="News feed"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {news.slice().reverse().map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-[#222] pb-2 text-body-default"
            >
              <div className="flex justify-between items-center mb-1 text-[11px] text-[#886600]">
                <span>{item.time}</span>
                {item.type === 'URGENT' && (
                  <span className="bg-red-950 text-red-500 border border-red-700 px-1 text-[10px] font-bold">URGENT</span>
                )}
                {item.type === 'ALERT' && (
                  <span className="bg-[#2a1b00] text-[#ff9900] border border-[#886600] px-1 text-[10px] font-bold">TRADE</span>
                )}
              </div>
              <p className="text-[#e2e2e2] leading-tight font-mono">{item.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
