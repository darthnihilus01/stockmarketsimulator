'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { usePrices } from '@/hooks/usePrices';
import { useNews } from '@/hooks/useNews';
import { TabNavigation } from '@/components/Layout/TabNavigation';
import { OrderWidget } from '@/components/Trade/OrderWidget';
import { PriceChart } from '@/components/Trade/PriceChart';
import { NewsFeed } from '@/components/Trade/NewsFeed';
import { MetricGrid } from '@/components/Portfolio/MetricGrid';
import { PortfolioChart } from '@/components/Portfolio/PortfolioChart';
import { ResearchTable } from '@/components/Research/ResearchTable';
import { ToastContainer } from '@/components/shared/Toast';

export default function TerminalPage() {
  const stocks = useStore((s) => s.stocks);
  const selectedTicker = useStore((s) => s.selectedTicker);
  const setSelectedTicker = useStore((s) => s.setSelectedTicker);
  const activeTab = useStore((s) => s.activeTab);
  const [sysTime, setSysTime] = useState('');

  usePrices();
  useNews();

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
        {/* Left Sidebar — ticker nav only on Trade tab */}
        {activeTab === 'trade' && (
          <aside className="w-48 bg-[#050505] border-r border-grid-line flex flex-col justify-between shrink-0 hidden md:flex">
            <div className="flex flex-col">
              <div className="p-3 border-b border-grid-line">
                <div className="text-headline-md text-[#ff9900]">SYS_STATUS</div>
                <div className="text-[10px] text-[#886600] mt-1 uppercase">FED RESERVE FEED: OK</div>
              </div>
              <nav className="flex flex-col mt-2" aria-label="Ticker navigation">
                {Object.keys(stocks).map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setSelectedTicker(sym)}
                    className={`px-4 py-2 text-left text-label-caps flex justify-between items-center transition-all cursor-pointer ${
                      selectedTicker === sym
                        ? 'bg-[#ff9900] text-black border-l-4 border-yellow-600 font-bold'
                        : 'text-[#a38d7a] hover:bg-[#1f1f1f] hover:text-[#ff9900]'
                    }`}
                    aria-label={`Select ${sym}`}
                    aria-pressed={selectedTicker === sym}
                  >
                    <span>{sym}</span>
                    {stocks[sym] && (
                      <span className={`text-[10px] ${
                        selectedTicker === sym
                          ? 'text-black'
                          : (stocks[sym].price >= stocks[sym].prevClose ? 'text-[#00ff00]' : 'text-[#ff0000]')
                      }`}>
                        {stocks[sym].price.toFixed(1)}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-3 border-t border-grid-line">
              <div className="text-[10px] text-[#886600]">API HOST: CLOUD_NET</div>
              <div className="text-[10px] text-white">LATENCY: 4.2ms</div>
            </div>
          </aside>
        )}

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
