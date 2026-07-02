'use client';

import { useStore } from '@/store/useStore';
import { useTrades } from '@/hooks/useTrades';
import { motion } from 'framer-motion';

export function OrderWidget() {
  const selectedTicker = useStore((s) => s.selectedTicker);
  const orderAction = useStore((s) => s.orderAction);
  const quantity = useStore((s) => s.quantity);
  const stocks = useStore((s) => s.stocks);
  const portfolio = useStore((s) => s.portfolio);
  const setOrderAction = useStore((s) => s.setOrderAction);
  const setQuantity = useStore((s) => s.setQuantity);
  const setSelectedTicker = useStore((s) => s.setSelectedTicker);
  const addNotification = useStore((s) => s.addNotification);
  const { execute, clearOrder } = useTrades();

  const activeStock = selectedTicker ? stocks[selectedTicker] : undefined;
  const currentPosition = selectedTicker ? (portfolio.positions[selectedTicker]?.shares ?? 0) : 0;
  const estValue = quantity * (activeStock?.price ?? 0);
  const canConfirm = selectedTicker && quantity > 0;

  const handleConfirm = () => {
    const error = execute();
    if (error) {
      addNotification(`ERROR: ${error}`);
    } else {
      addNotification(`ORDER EXECUTED: ${orderAction} ${quantity} ${selectedTicker}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-grid-line bg-[#050505] flex flex-col"
    >
      <div className="panel-header bg-[#0e0e0e]">
        <span className="text-headline-md text-[#886600]">ORDER</span>
      </div>

      <div className="p-3 flex flex-col gap-4">
        {/* Ticker Selector */}
        <div>
          <label className="text-label-caps text-muted-bronze block mb-1">TICKER</label>
          <div className="grid grid-cols-5 gap-1">
            {Object.keys(stocks).map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedTicker(sym)}
                className={`py-1.5 text-label-caps font-bold transition-all border cursor-pointer ${
                  selectedTicker === sym
                    ? 'bg-[#ff9900] text-black border-[#ff9900]'
                    : 'bg-transparent text-[#d5ac4a] border-[#886600] hover:bg-[#886600]/30'
                }`}
                aria-label={`Select ticker ${sym}`}
                aria-pressed={selectedTicker === sym}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Action Selector */}
        <div>
          <label className="text-label-caps text-muted-bronze block mb-1">ACTION</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrderAction('BUY')}
              className={`py-2 text-headline-md font-bold transition-all border cursor-pointer ${
                orderAction === 'BUY'
                  ? 'bg-[#00ff00] text-black border-[#00ff00]'
                  : 'bg-transparent text-[#00ff00] border-[#00ff00] hover:bg-[#00ff00]/10'
              }`}
              aria-label="Buy order"
              aria-pressed={orderAction === 'BUY'}
            >
              BUY
            </button>
            <button
              onClick={() => setOrderAction('SELL')}
              className={`py-2 text-headline-md font-bold transition-all border cursor-pointer ${
                orderAction === 'SELL'
                  ? 'bg-[#ff0000] text-black border-[#ff0000]'
                  : 'bg-transparent text-[#ff0000] border-[#ff0000] hover:bg-[#ff0000]/10'
              }`}
              aria-label="Sell order"
              aria-pressed={orderAction === 'SELL'}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="text-label-caps text-muted-bronze block mb-1">QUANTITY</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full bg-black border border-[#886600] text-[#ff9900] p-2 focus:outline-none focus:border-[#ff9900] text-right font-mono"
            min={1}
            aria-label="Order quantity"
          />
        </div>

        {/* Est Value */}
        <div className="border-t border-[#333] pt-2 flex justify-between text-body-tabular">
          <span className="text-[#886600]">EST. VALUE:</span>
          <span className="font-bold text-white">
            ${estValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {activeStock && (
          <div className="text-[11px] text-muted-bronze flex justify-between">
            <span>BALANCE: ${portfolio.cash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span>POSITION: {currentPosition} SHARES</span>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={clearOrder}
            className="border border-[#886600] text-[#d5ac4a] py-2 text-label-caps hover:bg-[#886600]/20 transition-all cursor-pointer"
            aria-label="Clear order form"
          >
            CLEAR
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`py-2 text-label-caps font-bold transition-all cursor-pointer ${
              canConfirm
                ? 'bg-[#ff9900] text-black hover:bg-[#ff9900]/80'
                : 'bg-[#333] text-[#666] cursor-not-allowed'
            }`}
            aria-label="Confirm order"
          >
            CONFIRM ORDER
          </button>
        </div>
      </div>
    </motion.div>
  );
}
