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
            <div className="bg-[#1E1E1E] backdrop-blur-2xl text-white p-8 rounded-3xl border border-[#BB86FC]/40 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🔑</div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#BB86FC] to-[#03DAC6] bg-clip-text text-transparent mb-2">
                  Join Private Room
                </h2>
                <p className="text-white/70 text-sm">
                  Enter the room ID to join the game
                </p>
              </div>

              {/* Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
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
                    className="w-full bg-[#121212] border border-[#BB86FC]/30 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#03DAC6] focus:border-transparent transition-all duration-300"
                    maxLength={20}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#BB86FC] text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* Buttons */}
                <button
                  onClick={handleJoin}
                  disabled={!roomId.trim()}
                  className="group w-full bg-[#03DAC6] hover:bg-[#03DAC6]/80 disabled:bg-[#252525] disabled:cursor-not-allowed text-[#121212] disabled:text-white/40 text-lg font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-[#03DAC6]/30 disabled:shadow-none disabled:hover:scale-100 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-xl">🚀</span>
                    <span>Join Room</span>
                  </div>
                </button>

                <button
                  onClick={handleClose}
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

export default JoinRoomModal;