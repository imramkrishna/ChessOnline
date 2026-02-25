import React from 'react';
import { motion } from 'framer-motion';

interface DrawResultMessageProps {
  onOpen?: () => void;
  onClose?: () => void;
  handleGoHome?: () => void;
  message: "accepted" | "rejected";
}

const DrawResultMessage = ({ onClose, onOpen, message, handleGoHome }: DrawResultMessageProps) => {
  const isAccepted = message === "accepted";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-lg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 bg-white/95 backdrop-blur-xl text-[#1a1a1a] p-8 rounded-3xl text-center max-w-md mx-auto border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="text-6xl mb-4">{isAccepted ? '🤝' : '✋'}</div>
        <h1 className={`text-3xl font-extrabold mb-2 ${
          isAccepted ? 'text-emerald-600' : 'text-[#c84032]'
        }`}>
          Draw {isAccepted ? 'Accepted' : 'Declined'}
        </h1>
        <p className="text-[#666] mb-6">
          {isAccepted 
            ? 'The game has ended in a draw. Well played!' 
            : 'Your opponent has declined the draw offer. The game continues!'
          }
        </p>

        <div className="space-y-3">
          {isAccepted && handleGoHome && (
            <button
              onClick={handleGoHome}
              className="w-full rounded-xl bg-[#1a1a1a] hover:bg-[#333] px-4 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
            >
              Go to Home
            </button>
          )}
          {!isAccepted && onClose && (
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#f5f5f3] hover:bg-[#eee] px-4 py-3 font-semibold text-[#1a1a1a] shadow-sm transition hover:scale-[1.02] border border-black/[0.06]"
            >
              Continue Playing
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default DrawResultMessage;
