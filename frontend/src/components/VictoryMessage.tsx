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
      className="relative bg-white/95 backdrop-blur-xl text-[#1a1a1a] p-8 rounded-3xl text-center max-w-md mx-auto border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-extrabold mb-2 text-emerald-600">
        {message || 'Victory!'}
      </h1>
      <p className="text-[#666]">
        Congratulations on your triumph! Ready for the next challenge?
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={onGoHome}
          className="w-full rounded-xl bg-[#1a1a1a] hover:bg-[#333] px-4 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02]"
        >
          Go to Home
        </button>
      </div>
    </motion.div>
  );
}

export default VictoryMessage;