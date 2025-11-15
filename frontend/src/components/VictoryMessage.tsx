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
      className="relative bg-[#1E1E1E] backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border border-[#03DAC6]/50 shadow-2xl"
    >
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-extrabold mb-2 text-[#03DAC6]">
        {message || 'Victory!'}
      </h1>
      <p className="text-white/70">
        Congratulations on your triumph! Ready for the next challenge?
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={onGoHome}
          className="w-full rounded-xl bg-[#03DAC6] hover:bg-[#03DAC6]/80 px-4 py-3 font-semibold text-[#121212] shadow-lg shadow-[#03DAC6]/30 transition hover:scale-[1.02] hover:shadow-[#03DAC6]/50"
        >
          Go to Home
        </button>
      </div>
    </motion.div>
  );
}

export default VictoryMessage;