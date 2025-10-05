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
            <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl text-white p-8 rounded-3xl border border-white/20 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🏰</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Private Room
                </h2>
                <p className="text-gray-300 text-sm">
                  Create a room or join with a room ID
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  onClick={onCreateRoom}
                  className="group w-full bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-purple-500/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">➕</span>
                    <span>Create New Room</span>
                  </div>
                </button>

                <button
                  onClick={onJoinRoom}
                  className="group w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-emerald-500/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">🔑</span>
                    <span>Join Room</span>
                  </div>
                </button>

                <button
                  onClick={onClose}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-base font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-white/20"
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