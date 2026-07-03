'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useSimulation } from '@/hooks/useSimulation';
import { TabNavigation } from '@/components/Layout/TabNavigation';
import { OrderWidget } from '@/components/Trade/OrderWidget';
import { PriceChart } from '@/components/Trade/PriceChart';
import { NewsFeed } from '@/components/Trade/NewsFeed';
import { MetricGrid } from '@/components/Portfolio/MetricGrid';
import { PortfolioChart } from '@/components/Portfolio/PortfolioChart';
import { ResearchTable } from '@/components/Research/ResearchTable';
import { ToastContainer } from '@/components/shared/Toast';

export default function TerminalPage() {
  const activeTab = useStore((s) => s.activeTab);
  const [sysTime, setSysTime] = useState('');

  useSimulation();

  // System clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setSysTime(d.toLocaleTimeString([], { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden bg-black text-[#ff9900]">
      {/* Top App Bar */}
      <header className="h-10 bg-black border-b border-grid-line flex justify-between items-center px-4 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <span className="text-headline-lg font-bold text-[#ff9900]">TERMINAL_V1.0</span>
          <TabNavigation />
        </div>
        <div className="flex items-center gap-4 text-[#ff9900]">
          <span className="text-label-caps text-muted-bronze hidden sm:inline">CONN: PROD-NY-4</span>
          <span className="text-label-caps text-[#886600]">{sysTime}</span>
          <button className="hover:bg-surface-container-highest p-1 cursor-pointer" aria-label="Settings">
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'trade' && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[#333333] overflow-hidden">
              {/* Left Column: Order + Price Chart */}
              <section className="lg:col-span-7 bg-black flex flex-col h-full overflow-hidden p-[1px] gap-[1px]">
                <OrderWidget />
                <div className="flex-1 min-h-0">
                  <PriceChart />
                </div>
              </section>

              {/* Right Column: News Feed */}
              <section className="lg:col-span-5 bg-black h-full overflow-hidden p-[1px]">
                <NewsFeed />
              </section>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="h-full flex flex-col gap-[1px] p-[1px] overflow-y-auto">
              <MetricGrid />
              <div className="flex-1 min-h-[300px]">
                <PortfolioChart />
              </div>
            </div>
          )}

          {activeTab === 'research' && (
            <div className="h-full flex flex-col p-[1px] overflow-hidden">
              <ResearchTable />
            </div>
          )}
        </main>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      <footer className="h-12 bg-[#0e0e0e] border-t border-[#ff9900] flex items-center px-4 gap-4 z-50 shrink-0">
        <span className="text-label-caps text-[#ff9900] shrink-0">CORE_CMD_PROMPT_v2.0.4</span>
        <div className="flex gap-3 text-label-caps text-[#886600] hidden lg:flex">
          <span className="cursor-pointer hover:text-[#ff9900]">_EXECUTE</span>
          <span className="cursor-pointer hover:text-[#ff9900]">_HISTORY</span>
          <span className="cursor-pointer hover:text-[#ff9900]">_STATUS</span>
        </div>
        <div className="flex-1 flex items-center bg-black border border-[#886600] h-8 px-2">
          <span className="text-[#ff9900] mr-2">&gt;</span>
          <input
            type="text"
            className="bg-transparent border-none outline-none text-[#ff9900] w-full font-mono text-[14px] focus:ring-0 p-0"
            placeholder="ENTER TICKER OR CMD (e.g. MSFT, HELP)"
            aria-label="Command prompt"
          />
          <span className="blinking-cursor w-2 h-4 bg-[#ff9900] inline-block ml-1" />
        </div>
      </footer>
    </div>
  );
}
