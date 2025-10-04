import React from 'react'
import { motion } from 'framer-motion';
interface PendingDrawMessageProps{
    onOpen?:()=>void;
    onClose?:()=>void;
    
}
const PendingDrawMessage = ({onOpen,onClose}:PendingDrawMessageProps) => {
  return (
<div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative z-10 bg-black/85 backdrop-blur-2xl text-white p-8 rounded-3xl text-center max-w-md mx-auto border border-blue-500/40 shadow-2xl"
      >
        <div className="text-6xl mb-4">🤝</div>
        <h1 className="text-3xl font-extrabold mb-2 text-blue-400">
          Draw Offer
        </h1>
        <p className="text-gray-300 mb-6">
          You have offered a draw. Waiting for opponent action.
        </p>

        <div className="flex gap-3">

        </div>
      </motion.div>
    </div>
  )
}

export default PendingDrawMessage
