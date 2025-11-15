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
      <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-lg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 bg-[#1E1E1E] backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border border-[#BB86FC]/50 shadow-2xl"
      >
        <div className="text-6xl mb-4">🤝</div>
        <h1 className="text-3xl font-extrabold mb-2 text-[#BB86FC]">
          Draw Offer
        </h1>
        <p className="text-white/70 mb-6">
          Your opponent has offered a draw. Do you accept?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 rounded-xl bg-[#03DAC6] hover:bg-[#03DAC6]/80 px-4 py-3 font-semibold text-[#121212] shadow-lg shadow-[#03DAC6]/30 transition hover:scale-[1.02] hover:shadow-[#03DAC6]/50"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="flex-1 rounded-xl bg-[#BB86FC] hover:bg-[#BB86FC]/80 px-4 py-3 font-semibold text-[#121212] shadow-lg shadow-[#BB86FC]/30 transition hover:scale-[1.02] hover:shadow-[#BB86FC]/50"
          >
            Decline
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default OfferDrawMessage;