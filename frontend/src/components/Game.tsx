import React, { useEffect, useState } from 'react'
import ChessBoard from './ChessBoard'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import { INIT_GAME, MOVE, GAME_OVER } from '../messages';
import { Chess } from 'chess.js';
const Game = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameStatus, setGameStatus] = useState('waiting'); // 'waiting', 'playing', 'finished'
    const [playerColor, setPlayerColor] = useState('white');
    const [opponent, setOpponent] = useState('');
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board())
    const navigate = useNavigate();
    const socket = useSocket();
    const handleStartGame = () => {
        setGameStarted(true);
        setGameStatus('playing');
        socket?.send(JSON.stringify({ type: INIT_GAME }));
    };

    const handleLeaveGame = () => {
        setGameStarted(false);
        setGameStatus('waiting');
        console.log('Leaving game...');
        socket?.send(JSON.stringify({ type: GAME_OVER }));
    };
    useEffect(() => {
        if (!socket) {
            return
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message)
            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("Game initialized.")
                    break;
                case MOVE:
                    console.log("♟️ Move received from server:", message.payload);

                    // Update the chess instance with the server's move
                    try {
                        const updatedChess = new Chess(message.board); // Use FEN from server
                        setChess(updatedChess);
                        setBoard(updatedChess.board());
                        console.log("✅ Board updated from server");
                    } catch (error) {
                        console.error("❌ Error updating board:", error);
                    }
                    break;
                case GAME_OVER:
                    console.log("Game over")
                    break;
                default:
                    console.log("Invalid message")

            }
        }
    }, [socket])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-7xl mx-auto h-full">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Chess<span className="text-purple-400">Online</span>
                    </h1>
                    <p className="text-gray-300">Live Chess Battle</p>
                </div>

                {/* Main Game Area */}
                <div className="grid lg:grid-cols-3 gap-6 items-start">
                    {/* Left Panel - Game Controls */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Game Status Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold text-white mb-4">Game Status</h2>

                            <div className="space-y-4">
                                {/* Status Indicator */}
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${gameStatus === 'playing' ? 'bg-green-400' :
                                        gameStatus === 'waiting' ? 'bg-yellow-400' : 'bg-red-400'
                                        }`}></div>
                                    <span className="text-white font-medium">
                                        {gameStatus === 'playing' ? 'Game Active' :
                                            gameStatus === 'waiting' ? 'Waiting for Opponent' : 'Game Ended'}
                                    </span>
                                </div>

                                {/* Player Info */}
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300">You</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${playerColor === 'white' ? 'bg-gray-200 text-black' : 'bg-gray-800 text-white'
                                            }`}>
                                            {playerColor}
                                        </span>
                                    </div>
                                    {opponent && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-300">Opponent</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${playerColor === 'white' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'
                                                }`}>
                                                {playerColor === 'white' ? 'black' : 'white'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Game Controls */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Controls</h3>

                            <div className="space-y-3">
                                {!gameStarted ? (
                                    <button
                                        onClick={handleStartGame}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        🎮 Start Game
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleLeaveGame}
                                        className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                                    >
                                        🚪 Leave Game
                                    </button>
                                )}

                                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                                    🔄 Request Draw
                                </button>

                                <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                                    🏳️ Resign
                                </button>
                            </div>
                        </div>

                        {/* Game Timer */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Timer</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Your Time</span>
                                    <span className="text-2xl font-mono text-green-400">10:00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Opponent</span>
                                    <span className="text-2xl font-mono text-blue-400">10:00</span>
                                </div>
                            </div>
                        </div>

                        {/* Move History */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Move History</h3>

                            <div className="max-h-32 overflow-y-auto text-sm text-gray-300">
                                <div className="space-y-1">
                                    <div>1. e4 e5</div>
                                    <div>2. Nf3 Nc6</div>
                                    <div>3. Bb5 a6</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Chess Board */}
                    <div className="lg:col-span-2 flex justify-center">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="text-center mb-4">
                                <h3 className="text-2xl font-bold text-white mb-2">Game Board</h3>
                                <p className="text-gray-300">
                                    {gameStarted ? `Playing as ${playerColor}` : 'Ready to play'}
                                </p>
                            </div>

                            {/* Chess Board Component */}
                            <div className="flex justify-center">
                                <ChessBoard setBoard={setBoard} chess={chess} board={board} socket={socket} />
                            </div>

                            {/* Game Info Below Board */}
                            <div className="mt-4 text-center">
                                <div className="inline-flex items-center space-x-4 bg-white/5 rounded-lg px-4 py-2">
                                    <span className="text-gray-300">Turn:</span>
                                    <span className="text-white font-bold">White</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-300">Move:</span>
                                    <span className="text-white font-bold">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="mt-6 text-center">
                    <button onClick={() => navigate("/")} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Game