import React from 'react';
import { motion } from 'framer-motion';

interface WaitingForOpponentModalProps {
  isOpen: boolean;
  roomId: string;
  onCancel: () => void;
}

const WaitingForOpponentModal: React.FC<WaitingForOpponentModalProps> = ({
  isOpen,
  roomId,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-lg"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1E1E1E] backdrop-blur-2xl text-white p-8 rounded-3xl border border-[#BB86FC]/40 shadow-2xl">
          {/* Animated Loading Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="text-6xl"
            >
              ⏳
            </motion.div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Waiting for Opponent
            </h2>
            <p className="text-white/70 text-sm">
              Share the room ID with your friend to start playing
            </p>
          </div>

          {/* Room ID Display */}
          <div className="bg-[#121212] rounded-xl p-4 mb-6 border border-[#BB86FC]/30">
            <div className="text-center">
              <p className="text-white/70 text-xs mb-2">Room ID</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-2xl font-bold text-[#03DAC6] tracking-wider">
                  {roomId}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(roomId)}
                  className="p-2 hover:bg-[#252525] rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-[#BB86FC] rounded-full"
              />
            ))}
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="w-full bg-[#121212] hover:bg-[#252525] text-white text-base font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-[#BB86FC]/30"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WaitingForOpponentModal;