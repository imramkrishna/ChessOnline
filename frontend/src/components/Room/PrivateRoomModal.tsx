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
            <div className="bg-[#1E1E1E] backdrop-blur-2xl text-white p-8 rounded-3xl border border-[#BB86FC]/40 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🏰</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] bg-clip-text text-transparent mb-2">
                  Private Room
                </h2>
                <p className="text-white/70 text-sm">
                  Create a room or join with a room ID
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  onClick={onCreateRoom}
                  className="group w-full bg-[#BB86FC] hover:bg-[#BB86FC]/80 text-[#121212] text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-[#BB86FC]/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">➕</span>
                    <span>Create New Room</span>
                  </div>
                </button>

                <button
                  onClick={onJoinRoom}
                  className="group w-full bg-[#03DAC6] hover:bg-[#03DAC6]/80 text-[#121212] text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-[#03DAC6]/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">🔑</span>
                    <span>Join Room</span>
                  </div>
                </button>

                <button
                  onClick={onClose}
                  className="w-full bg-[#121212] hover:bg-[#252525] text-white text-base font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-[#BB86FC]/30"
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