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
      <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-lg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 bg-[#1E1E1E] backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border border-[#BB86FC]/50 shadow-2xl"
      >
        <div className="text-6xl mb-4">{isAccepted ? '🤝' : '✋'}</div>
        <h1 className={`text-3xl font-extrabold mb-2 ${
          isAccepted ? 'text-[#03DAC6]' : 'text-[#BB86FC]'
        }`}>
          Draw {isAccepted ? 'Accepted' : 'Declined'}
        </h1>
        <p className="text-white/70 mb-6">
          {isAccepted 
            ? 'The game has ended in a draw. Well played!' 
            : 'Your opponent has declined the draw offer. The game continues!'
          }
        </p>

        <div className="space-y-3">
          {isAccepted && handleGoHome && (
            <button
              onClick={handleGoHome}
              className="w-full rounded-xl bg-[#03DAC6] hover:bg-[#03DAC6]/80 px-4 py-3 font-semibold text-[#121212] shadow-lg shadow-[#03DAC6]/30 transition hover:scale-[1.02] hover:shadow-[#03DAC6]/50"
            >
              Go to Home
            </button>
          )}
          {!isAccepted && onClose && (
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#121212] hover:bg-[#252525] px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] border border-[#BB86FC]/30"
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
