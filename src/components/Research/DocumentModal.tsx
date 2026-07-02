'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { StockData } from '@/types';

interface DocumentModalProps {
  ticker: string | null;
  stock: StockData | undefined;
  onClose: () => void;
}

export function DocumentModal({ ticker, stock, onClose }: DocumentModalProps) {
  if (!ticker || !stock) return null;

  return (
    <Dialog open={!!ticker} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#0e0e0e] border border-[#886600] text-[#e2e2e2] max-w-lg font-mono">
        <DialogHeader>
          <DialogTitle className="text-headline-lg text-[#ff9900]">
            {stock.symbol} — RESEARCH
          </DialogTitle>
          <DialogDescription className="text-[#886600] text-[11px]">
            {stock.name} · {stock.type || 'EQUITY'}
          </DialogDescription>
        </DialogHeader>
        <div className="text-[13px] leading-relaxed text-[#e2e2e2] whitespace-pre-wrap">
          {stock.research || 'No research document available for this instrument.'}
        </div>
      </DialogContent>
    </Dialog>
  );
}
