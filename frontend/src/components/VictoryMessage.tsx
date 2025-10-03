//animted resignation screen
import React from 'react';
import { motion } from 'framer-motion';

interface VictoryMessageProps {
  message?: string;
  onGoHome: () => void;
  onClose?: () => void;
}

const VictoryMessage: React.FC<VictoryMessageProps> = ({ message, onGoHome, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative bg-black/85 backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border border-green-500/40 shadow-2xl"
    >
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-extrabold mb-2 text-green-400">
        {message || 'Victory!'}
      </h1>
      <p className="text-gray-300">
        Congratulations on your triumph! Ready for the next challenge?
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={onGoHome}
          className="w-full rounded-xl bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 px-4 py-3 font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:scale-[1.02] hover:shadow-emerald-400/50"
        >
          Go to Home
        </button>
      </div>
    </motion.div>
  );
}

export default VictoryMessage;