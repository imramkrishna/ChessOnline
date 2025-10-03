import React from 'react';
import { motion } from 'framer-motion';

interface DefeatMessageProps {
  message?: string;
  onGoHome: () => void;
  onClose?: () => void;
}

const DefeatMessage: React.FC<DefeatMessageProps> = ({ message, onGoHome, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative bg-black/85 backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border border-red-500/40 shadow-2xl"
    >
      <div className="text-6xl mb-4">😔</div>
      <h1 className="text-3xl font-extrabold mb-2 text-red-400">
        {message || 'You Resigned'}
      </h1>
      <p className="text-gray-300">
        Tough break—but every defeat is a lesson. Ready to regroup?
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={onGoHome}
          className="w-full rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:scale-[1.02] hover:shadow-rose-400/50"
        >
          Go to Home
        </button>
      </div>
    </motion.div>
  );
}

export default DefeatMessage;