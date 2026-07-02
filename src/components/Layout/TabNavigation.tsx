'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import type { TabId } from '@/types';
import { BarChart3, Briefcase, Search } from 'lucide-react';

const TABS: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: 'trade', label: 'Trade', icon: BarChart3 },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'research', label: 'Research', icon: Search },
];

export function TabNavigation() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);

  return (
    <nav className="flex items-center gap-1" role="tablist" aria-label="Application tabs">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-label-caps transition-all cursor-pointer relative ${
              isActive
                ? 'bg-[#ff9900] text-black font-bold'
                : 'text-[#d5ac4a] hover:bg-[#1f1f1f] hover:text-[#ff9900]'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff9900]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
