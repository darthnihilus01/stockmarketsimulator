'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { X } from 'lucide-react';

export function ToastContainer() {
  const notifications = useStore((s) => s.notifications);
  const dismissNotification = useStore((s) => s.dismissNotification);

  return (
    <div className="fixed bottom-14 right-4 z-50 flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-[#0e0e0e] border border-[#ff9900] p-3 text-[12px] font-mono text-[#ff9900] shadow-lg"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold uppercase text-[10px] text-[#886600]">SYSTEM TRANSACTION LOG</span>
              <button
                onClick={() => dismissNotification(n.id)}
                className="hover:text-white ml-2 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
            {n.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
