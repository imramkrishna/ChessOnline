import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

const PrivateRoomModal: React.FC<PrivateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="bg-white/95 backdrop-blur-xl text-[#1a1a1a] p-8 rounded-3xl border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🏰</div>
                <h2 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                  Private Room
                </h2>
                <p className="text-[#888] text-sm">
                  Create a room or join with a room ID
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  onClick={onCreateRoom}
                  className="group w-full bg-[#1a1a1a] hover:bg-[#333] text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                >
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">➕</span>
                    <span>Create New Room</span>
                  </div>
                </button>

                <button
                  onClick={onJoinRoom}
                  className="group w-full bg-[#f5f5f3] hover:bg-[#eee] text-[#1a1a1a] text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:shadow-lg border border-black/[0.06] relative overflow-hidden"
                >
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">🔑</span>
                    <span>Join Room</span>
                  </div>
                </button>

                <button
                  onClick={onClose}
                  className="w-full bg-transparent hover:bg-black/[0.04] text-[#888] text-base font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-black/[0.06]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrivateRoomModal;