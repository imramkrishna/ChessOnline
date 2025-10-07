import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../hooks/useSocket';
import { ERROR, JOIN_ROOM, ROOM_JOINED } from '../../messages';
interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
  socket: WebSocket | null;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  socket
}) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const handleJoin = () => {
    if(roomId.length===0){
      setError('Room ID cannot be empty');
      return;
    }
    socket?.send(JSON.stringify({ type: JOIN_ROOM, roomID: roomId }));
  };
  const handleClose = () => {
    setRoomId('');
    setError('');
    onClose();
  };
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if(message.type === ROOM_JOINED) {
        onJoin(message.roomID);
        handleClose();
        setRoomId('');
        setError('');
      }
      if (message.type === ERROR) {
        setError(message.message);
      }
  }}, [socket]);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
            onClick={handleClose}
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
                <div className="text-5xl mb-4">🔑</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  Join Private Room
                </h2>
                <p className="text-gray-300 text-sm">
                  Enter the room ID to join the game
                </p>
              </div>

              {/* Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room ID
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => {
                      setRoomId(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Enter room ID"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    maxLength={20}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* Buttons */}
                <button
                  onClick={handleJoin}
                  disabled={!roomId.trim()}
                  className="group w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-emerald-500/30 disabled:shadow-none disabled:hover:scale-100 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">🚀</span>
                    <span>Join Room</span>
                  </div>
                </button>

                <button
                  onClick={handleClose}
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

export default JoinRoomModal;