import React from 'react';
import { motion } from 'framer-motion';

interface OfferDrawMessageProps {
  onOpen?: () => void;
  onClose?: () => void;
  onAccept: () => void;
  onReject: () => void;
}

const OfferDrawMessage = ({ onOpen, onClose, onAccept, onReject }: OfferDrawMessageProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-lg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 bg-white/95 backdrop-blur-xl text-[#1a1a1a] p-8 rounded-3xl text-center max-w-md mx-auto border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="text-6xl mb-4">🤝</div>
        <h1 className="text-3xl font-extrabold mb-2 text-[#1a1a1a]">
          Draw Offer
        </h1>
        <p className="text-[#666] mb-6">
          Your opponent has offered a draw. Do you accept?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 rounded-xl bg-[#1a1a1a] hover:bg-[#333] px-4 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="flex-1 rounded-xl bg-[#c84032] hover:bg-[#b5372a] px-4 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
          >
            Decline
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default OfferDrawMessage;