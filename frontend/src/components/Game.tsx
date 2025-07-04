import React, { useEffect, useState } from 'react'
import ChessBoard from './ChessBoard'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import { INIT_GAME, MOVE, GAME_OVER } from '../messages';
import { Chess } from 'chess.js';

const Game = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameStatus, setGameStatus] = useState('waiting');
    const [playerColor, setPlayerColor] = useState('');
    const [opponent, setOpponent] = useState('');
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [currentTurn, setCurrentTurn] = useState('w');
    const [moveCount, setMoveCount] = useState(1);
    const navigate = useNavigate();
    const socket = useSocket();

    const handleStartGame = () => {
        setGameStarted(false);
        setGameStatus('waiting');
        setPlayerColor('');
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
                    // Only start game when server confirms both players joined
                    if (message.payload && message.payload.color) {
                        setPlayerColor(message.payload.color);
                        setGameStarted(true);
                        setGameStatus('playing');
                        setChess(new Chess());
                        setBoard(new Chess().board());
                        setCurrentTurn('w');
                        setMoveCount(1);
                        console.log(`Game initialized. You are playing as ${message.payload.color}`);
                    } else {
                        console.log("Waiting for opponent to join...");
                    }
                    break;
                case MOVE:
                    console.log("♟️ Move received from server:", message.payload);
                    try {
                        const updatedChess = new Chess(message.board);
                        setChess(updatedChess);
                        setBoard(updatedChess.board());
                        setCurrentTurn(updatedChess.turn());
                        setMoveCount(Math.ceil(updatedChess.history().length / 2) + 1);
                        console.log("✅ Board updated from server");
                    } catch (error) {
                        console.error("❌ Error updating board:", error);
                    }
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    setGameStarted(false);
                    setGameStatus('ended');
                    break;
                default:
                    console.log("Invalid message")
            }
        }
    }, [socket])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6 lg:mb-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                            Chess<span className="text-purple-400 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Online</span>
                        </h1>
                        <p className="text-gray-300 text-lg">Live Chess Battle Arena</p>
                    </div>

                    {/* Main Game Area - Mobile First Design */}
                    <div className="flex flex-col lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                        {/* Chess Board - Mobile First */}
                        <div className="lg:col-span-3 xl:col-span-4 order-1">
                            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl lg:rounded-3xl p-4 lg:p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 ring-1 ring-white/5">
                                <div className="text-center mb-4 lg:mb-8">
                                    <h3 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        Game Board
                                    </h3>
                                    <p className="text-gray-300 text-base lg:text-xl font-medium">
                                        {gameStarted ? `Playing as ${playerColor}` : 'Ready to play'}
                                    </p>
                                </div>

                                {/* Chess Board Component */}
                                <div className="flex justify-center mb-4 lg:mb-6">
                                    <ChessBoard
                                        setBoard={setBoard}
                                        chess={chess}
                                        board={board}
                                        socket={socket}
                                        playerColor={playerColor}
                                        gameStarted={gameStarted}
                                        currentTurn={currentTurn}
                                    />
                                </div>

                                {/* Game Info Below Board - Enhanced */}
                                <div className="flex justify-center">
                                    <div className="flex items-center space-x-4 lg:space-x-8 bg-gradient-to-r from-white/10 to-purple-500/10 backdrop-blur-lg rounded-xl px-4 lg:px-8 py-3 lg:py-4 text-sm lg:text-lg border border-white/20 shadow-lg">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                                            <span className="text-gray-200 font-medium">Turn:</span>
                                            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                {currentTurn === 'w' ? 'White' : 'Black'}
                                            </span>
                                        </div>
                                        <div className="w-px h-5 lg:h-7 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-200 font-medium">Move:</span>
                                            <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{moveCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Control Panel - Compact for Mobile */}
                        <div className="lg:col-span-1 xl:col-span-1 space-y-3 lg:space-y-4 order-2">
                            {/* Game Status Card - Enhanced */}
                            <div className="bg-gradient-to-br from-white/10 to-purple-500/5 backdrop-blur-2xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 ring-1 ring-white/10">
                                <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 flex items-center">
                                    <span className="text-2xl lg:text-3xl mr-3 animate-pulse">🎮</span>
                                    <span className="hidden sm:inline bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Game Status</span>
                                    <span className="sm:hidden bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Status</span>
                                </h2>

                                <div className="space-y-4">
                                    {/* Status Indicator - Enhanced */}
                                    <div className="flex items-center space-x-3 p-3 lg:p-4 bg-gradient-to-r from-white/10 to-purple-500/10 rounded-xl border border-white/20 backdrop-blur-sm">
                                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full shadow-lg ${gameStatus === 'playing' ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' :
                                            gameStatus === 'waiting' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-gradient-to-r from-red-400 to-red-600'
                                            }`}></div>
                                        <span className="text-white font-semibold text-sm lg:text-base">
                                            {gameStatus === 'playing' ? 'Game Active' :
                                                gameStatus === 'waiting' ? 'Waiting for Player' : 'Game Ended'}
                                        </span>
                                    </div>

                                    {/* Player Info - Enhanced */}
                                    <div className="bg-gradient-to-r from-white/5 to-purple-500/5 rounded-xl p-3 lg:p-4 space-y-3 border border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-200 flex items-center text-sm lg:text-base font-medium">
                                                <span className="text-lg lg:text-xl mr-2">👤</span>
                                                You
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs lg:text-sm font-bold shadow-lg ${playerColor === 'white' ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-black' : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600'
                                                }`}>
                                                {playerColor}
                                            </span>
                                        </div>
                                        {opponent && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-200 flex items-center text-sm lg:text-base font-medium">
                                                    <span className="text-lg lg:text-xl mr-2">🤖</span>
                                                    Opponent
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs lg:text-sm font-bold shadow-lg ${playerColor === 'white' ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-black'
                                                    }`}>
                                                    {playerColor === 'white' ? 'black' : 'white'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Game Controls - Compact */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                                <h3 className="text-lg lg:text-xl font-bold text-white mb-3 flex items-center">
                                    <span className="text-lg lg:text-xl mr-2">🎯</span>
                                    <span className="hidden sm:inline">Controls</span>
                                    <span className="sm:hidden">Game</span>
                                </h3>

                                <div className="space-y-2 lg:space-y-3">
                                    {!gameStarted ? (
                                        <button
                                            onClick={handleStartGame}
                                            className="group w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 lg:py-3 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center justify-center space-x-1 lg:space-x-2">
                                                <span className="text-lg">🎮</span>
                                                <span className="text-sm lg:text-base">Start Game</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleLeaveGame}
                                            className="group w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-2 lg:py-3 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center justify-center space-x-1 lg:space-x-2">
                                                <span className="text-lg">🚪</span>
                                                <span className="text-sm lg:text-base">Leave Game</span>
                                            </div>
                                        </button>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 lg:gap-3">
                                        <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-2 lg:px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex flex-col items-center justify-center space-y-1">
                                                <span className="text-lg">🔄</span>
                                                <span className="text-xs lg:text-sm">Draw</span>
                                            </div>
                                        </button>

                                        <button className="group bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-2 px-2 lg:px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex flex-col items-center justify-center space-y-1">
                                                <span className="text-lg">🏳️</span>
                                                <span className="text-xs lg:text-sm">Resign</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Game Timer - Compact */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                                <h3 className="text-lg lg:text-xl font-bold text-white mb-3 flex items-center">
                                    <span className="text-lg lg:text-xl mr-2">⏱️</span>
                                    Timer
                                </h3>

                                <div className="space-y-2 lg:space-y-3">
                                    <div className="flex justify-between items-center p-2 lg:p-3 bg-white/5 rounded-lg">
                                        <span className="text-gray-300 flex items-center text-sm lg:text-base">
                                            <span className="text-sm lg:text-lg mr-1 lg:mr-2">👤</span>
                                            <span className="hidden sm:inline">Your Time</span>
                                            <span className="sm:hidden">You</span>
                                        </span>
                                        <span className="text-lg lg:text-2xl font-mono text-green-400 font-bold">10:00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 lg:p-3 bg-white/5 rounded-lg">
                                        <span className="text-gray-300 flex items-center text-sm lg:text-base">
                                            <span className="text-sm lg:text-lg mr-1 lg:mr-2">🤖</span>
                                            <span className="hidden sm:inline">Opponent</span>
                                            <span className="sm:hidden">Opp</span>
                                        </span>
                                        <span className="text-lg lg:text-2xl font-mono text-blue-400 font-bold">10:00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Move History - Compact */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hidden lg:block">
                                <h3 className="text-lg lg:text-xl font-bold text-white mb-3 flex items-center">
                                    <span className="text-lg lg:text-xl mr-2">📋</span>
                                    History
                                </h3>

                                <div className="max-h-24 lg:max-h-32 overflow-y-auto text-sm text-gray-300 bg-white/5 rounded-lg p-2 lg:p-3">
                                    <div className="space-y-1 lg:space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">1.</span>
                                            <span>e4 e5</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">2.</span>
                                            <span>Nf3 Nc6</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">3.</span>
                                            <span>Bb5 a6</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="mt-6 lg:mt-8 text-center">
                        <button
                            onClick={() => navigate("/")}
                            className="group bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-white/20"
                        >
                            <span className="flex items-center justify-center space-x-2">
                                <span>←</span>
                                <span>Back to Home</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game