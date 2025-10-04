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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 bg-black/85 backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border border-blue-500/40 shadow-2xl"
      >
        <div className="text-6xl mb-4">🤝</div>
        <h1 className="text-3xl font-extrabold mb-2 text-blue-400">
          Draw Offer
        </h1>
        <p className="text-gray-300 mb-6">
          Your opponent has offered a draw. Do you accept?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 rounded-xl bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 px-4 py-3 font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-400/50"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:scale-[1.02] hover:shadow-rose-400/50"
          >
            Decline
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default OfferDrawMessage;