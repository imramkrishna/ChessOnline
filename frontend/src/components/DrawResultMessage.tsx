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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`relative z-10 bg-black/85 backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border ${
          isAccepted ? 'border-blue-500/40' : 'border-orange-500/40'
        } shadow-2xl`}
      >
        <div className="text-6xl mb-4">{isAccepted ? '🤝' : '✋'}</div>
        <h1 className={`text-3xl font-extrabold mb-2 ${
          isAccepted ? 'text-blue-400' : 'text-orange-400'
        }`}>
          Draw {isAccepted ? 'Accepted' : 'Declined'}
        </h1>
        <p className="text-gray-300 mb-6">
          {isAccepted 
            ? 'The game has ended in a draw. Well played!' 
            : 'Your opponent has declined the draw offer. The game continues!'
          }
        </p>

        <div className="space-y-3">
          {isAccepted && handleGoHome && (
            <button
              onClick={handleGoHome}
              className="w-full rounded-xl bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 px-4 py-3 font-semibold text-black shadow-lg shadow-cyan-500/30 transition hover:scale-[1.02] hover:shadow-cyan-400/50"
            >
              Go to Home
            </button>
          )}
          {!isAccepted && onClose && (
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-white/10 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-white/20"
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
