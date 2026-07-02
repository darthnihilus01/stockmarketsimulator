'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { DocumentModal } from './DocumentModal';

export function ResearchTable() {
  const stocks = useStore((s) => s.stocks);
  const [search, setSearch] = useState('');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [docTicker, setDocTicker] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return Object.values(stocks).filter((s) =>
      !query ||
      s.symbol.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      (s.type && s.type.toLowerCase().includes(query))
    );
  }, [stocks, search]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-grid-line bg-[#050505] flex flex-col flex-1"
    >
      <div className="panel-header bg-[#0e0e0e] flex justify-between items-center">
        <span className="text-headline-md text-[#886600]">INVESTMENT UNIVERSE</span>
        <div className="flex items-center gap-2">
          <Search size={14} className="text-[#886600]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by ticker, company, or type..."
            className="bg-black border border-[#886600] text-[#ff9900] px-2 py-1 text-[12px] font-mono focus:outline-none focus:border-[#ff9900] w-48"
            aria-label="Search research table"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-[13px] font-mono" role="table" aria-label="Research data table">
          <thead>
            <tr className="border-b border-grid-line bg-[#111]">
              <th className="text-left p-2 text-label-caps text-[#886600]">TICKER</th>
              <th className="text-left p-2 text-label-caps text-[#886600]">COMPANY</th>
              <th className="text-right p-2 text-label-caps text-[#886600]">PRICE</th>
              <th className="text-right p-2 text-label-caps text-[#886600]">CHANGE %</th>
              <th className="text-left p-2 text-label-caps text-[#886600]">TYPE</th>
              <th className="text-center p-2 text-label-caps text-[#886600]">RESEARCH</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock, idx) => {
              const changePercent = ((stock.price - stock.prevClose) / stock.prevClose) * 100;
              const isPositive = changePercent >= 0;

              return (
                <motion.tr
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`border-b border-[#222] hover:bg-[#111] transition-colors cursor-pointer ${
                    selectedTicker === stock.symbol ? 'bg-[#1a1a1a]' : ''
                  }`}
                  onClick={() => setSelectedTicker(stock.symbol)}
                  role="row"
                >
                  <td className="p-2 font-bold text-[#ff9900]">{stock.symbol}</td>
                  <td className="p-2 text-[#e2e2e2]">{stock.name}</td>
                  <td className="p-2 text-right text-white">${stock.price.toFixed(2)}</td>
                  <td className={`p-2 text-right ${isPositive ? 'text-[#00ff00]' : 'text-[#ff0000]'}`}>
                    {isPositive ? '▲' : '▼'} {changePercent.toFixed(2)}%
                  </td>
                  <td className="p-2">
                    <span className="bg-[#222] text-[#d5ac4a] px-1.5 py-0.5 text-[10px]">{stock.type || 'N/A'}</span>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDocTicker(stock.symbol); }}
                      className="border border-[#886600] text-[#d5ac4a] px-2 py-1 text-[10px] hover:bg-[#886600]/20 transition-all cursor-pointer"
                      aria-label={`View research document for ${stock.symbol}`}
                    >
                      VIEW DOCUMENT
                    </button>
                  </td>
                </motion.tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#886600]">
                  NO RESULTS FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DocumentModal
        ticker={docTicker}
        stock={docTicker ? stocks[docTicker] : undefined}
        onClose={() => setDocTicker(null)}
      />
    </motion.div>
  );
}
