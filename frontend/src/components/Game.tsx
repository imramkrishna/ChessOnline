import React, { useEffect, useState } from 'react'
import ChessBoard from './ChessBoard'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import { INIT_GAME, MOVE, GAME_OVER, RESIGN } from '../messages';
import { Chess } from 'chess.js';
interface moveType {
    from: string,
    to: string
}
interface Moves {
    player: WebSocket,
    moveTime: Date,
    move: moveType
}
const Game = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameStatus, setGameStatus] = useState('waiting');
    const [gameTime, setGameTime] = useState(0);
    const [playerColor, setPlayerColor] = useState('');
    const [moveHistory, setMoveHistory] = useState<Moves[] | []>([])
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [currentTurn, setCurrentTurn] = useState('w');
    const [moveCount, setMoveCount] = useState(1);
    const [resignLoading, setResignLoading] = useState<boolean>(false)
    const navigate = useNavigate();
    const socket = useSocket();
    // Auto-connect when component mounts
    useEffect(() => {
        let timer: number;
        if (gameStarted) {
            timer = setInterval(() => {
                setGameTime((prev) => prev + 1);
            }, 1000);
        } else {
            setGameTime(0);
        }
        return () => {
            if (timer) clearInterval(timer);
        }
    }, [gameStarted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };
    useEffect(() => {
        if (socket && gameStatus === 'waiting' && !gameStarted) {
            console.log('Auto-connecting to find opponent...');
            socket.send(JSON.stringify({ type: INIT_GAME }));
        }
    }, [socket]);
    const handleResign = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(JSON.stringify({ type: RESIGN }))
                // optionally wait for server ack before navigating
                navigate("/")
            } catch (err) {
                console.error("Failed to send resign message:", err)
            }
        } else {
            console.warn("Socket not connected, cannot resign.")
            navigate("/") // maybe still navigate
        }
    }
    const handleLeaveGame = () => {
        setGameStarted(false);
        setGameStatus('waiting');
        setPlayerColor('');
        console.log('Leaving game...');
        socket?.send(JSON.stringify({ type: GAME_OVER }));
    };

    useEffect(() => {
        if (!socket) {
            return
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
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
                        setMoveHistory([])
                        const updatedChess = new Chess(message.board);
                        setChess(updatedChess);
                        setBoard(updatedChess.board());
                        setCurrentTurn(updatedChess.turn());
                        setMoveCount(Math.ceil(updatedChess.history().length / 2) + 1);
                        console.log("✅ Board updated from server");
                        setMoveHistory(message.AllMoves)
                    } catch (error) {
                        console.error("❌ Error updating board:", error);
                    }
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    setGameStarted(false);
                    setGameStatus('ended');
                    break;
                case RESIGN:
                    console.log("Opponent resigned. You win!");
                    alert("You win! Opponent resigned.");
                    setGameStarted(false);
                    setGameStatus('ended');
                    navigate("/")
                    break;
                default:
                    console.log("Invalid message")
            }
        }
    }, [socket])
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden overflow-y-auto">
            {/* Enhanced Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>

                {/* Floating chess pieces animation */}
                <div className="absolute top-10 left-10 text-4xl text-white/5 animate-bounce">♔</div>
                <div className="absolute top-20 right-20 text-3xl text-white/5 animate-pulse">♛</div>
                <div className="absolute bottom-20 left-20 text-3xl text-white/5 animate-bounce">♜</div>
                <div className="absolute bottom-10 right-10 text-4xl text-white/5 animate-pulse">♞</div>
            </div>

            <div className="relative z-10 p-4 sm:p-6 lg:p-8 w-full">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="text-center mb-6 lg:mb-8 px-2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                            Chess<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Online</span>
                        </h1>
                        <p className="text-gray-300 text-lg">Live Chess Battle Arena</p>
                    </div>

                    {/* Main Game Area - Responsive and Overflow-Safe */}
                    <div className="flex flex-col lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 w-full">
                        {/* Chess Board - Responsive Container */}
                        <div className="lg:col-span-3 xl:col-span-4 order-1 w-full">
                            <div className="bg-white/5 backdrop-blur-2xl rounded-2xl lg:rounded-3xl p-4 lg:p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 ring-1 ring-white/5 w-full overflow-hidden">
                                <div className="text-center mb-4 lg:mb-8">
                                    <h3 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        Game Board
                                    </h3>
                                    <p className="text-gray-300 text-base lg:text-xl font-medium">
                                        {gameStarted ? (
                                            <span className="flex items-center justify-center space-x-2">
                                                <span>Playing as</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${playerColor === 'white'
                                                    ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-black shadow-lg'
                                                    : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600 shadow-lg'
                                                    }`}>
                                                    {playerColor}
                                                </span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center space-x-2">
                                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                                <span>Searching for opponent...</span>
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Chess Board Component - Centered and Overflow-Safe */}
                                <div className="flex justify-center mb-4 lg:mb-6 w-full overflow-hidden">
                                    <div className="w-full max-w-lg flex justify-center">
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
                                </div>

                                {/* Game Info Below Board - Enhanced with Turn Indicator */}
                                <div className="flex justify-center">
                                    <div className="flex items-center space-x-4 lg:space-x-8 bg-gradient-to-r from-white/10 to-purple-500/10 backdrop-blur-lg rounded-xl px-4 lg:px-8 py-3 lg:py-4 text-sm lg:text-lg border border-white/20 shadow-lg">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full shadow-lg ${gameStarted
                                                ? 'bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse'
                                                : 'bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse'
                                                }`}></div>
                                            <span className="text-gray-200 font-medium">Turn:</span>
                                            <span className={`font-bold px-2 py-1 rounded-md ${currentTurn === 'w'
                                                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-black'
                                                : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600'
                                                }`}>
                                                {currentTurn === 'w' ? 'White' : 'Black'}
                                            </span>
                                            {gameStarted && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${(playerColor === 'white' && currentTurn === 'w') || (playerColor === 'black' && currentTurn === 'b')
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                    }`}>
                                                    {(playerColor === 'white' && currentTurn === 'w') || (playerColor === 'black' && currentTurn === 'b')
                                                        ? 'Your Turn'
                                                        : 'Opponent\'s Turn'
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-px h-5 lg:h-7 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-gray-200 font-medium">Move:</span>
                                            <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-xl">
                                                {moveCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Control Panel - Responsive */}
                        <div className="lg:col-span-1 xl:col-span-1 space-y-3 lg:space-y-4 order-2 w-full overflow-hidden">
                            {/* Game Status Card - Enhanced and Overflow-Safe */}
                            <div className="bg-gradient-to-br from-white/10 to-purple-500/5 backdrop-blur-2xl rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 ring-1 ring-white/10 overflow-hidden">
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

                                    {/* Player Info - Fixed Overflow Issues */}
                                    <div className="bg-gradient-to-r from-white/5 to-purple-500/5 rounded-xl p-3 lg:p-4 space-y-3 border border-white/10 overflow-hidden">
                                        <div className="flex justify-between items-center min-w-0">
                                            <span className="text-gray-200 flex items-center text-sm lg:text-base font-medium flex-shrink-0">
                                                <span className="text-lg lg:text-xl mr-2">👤</span>
                                                You
                                            </span>
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                {playerColor && (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap ${playerColor === 'white'
                                                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-black'
                                                        : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600'
                                                        }`}>
                                                        {playerColor}
                                                    </span>
                                                )}
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${gameStarted ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
                                                    }`}></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center min-w-0">
                                            <span className="text-gray-200 flex items-center text-sm lg:text-base font-medium flex-shrink-0">
                                                <span className="text-lg lg:text-xl mr-2">🤖</span>
                                                Opponent
                                            </span>
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                {gameStarted ? (
                                                    <>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap ${playerColor === 'white'
                                                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-600'
                                                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-black'
                                                            }`}>
                                                            {playerColor === 'white' ? 'black' : 'white'}
                                                        </span>
                                                        <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-500/20 rounded-md whitespace-nowrap">
                                                        Searching...
                                                    </span>
                                                )}
                                            </div>
                                        </div>
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
                                    {gameStarted ? (
                                        <>
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

                                            <div className="grid grid-cols-2 gap-2 lg:gap-3">
                                                <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-2 lg:px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex flex-col items-center justify-center space-y-1">
                                                        <span className="text-lg">�</span>
                                                        <span className="text-xs lg:text-sm">Draw</span>
                                                    </div>
                                                </button>

                                                <button className="group bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-2 px-2 lg:px-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden"
                                                    onClick={() => handleResign()}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex flex-col items-center justify-center space-y-1">
                                                        <span className="text-lg">🏳️</span>
                                                        <span className="text-xs lg:text-sm">Resign</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4 lg:py-6">
                                            <div className="animate-spin w-8 h-8 lg:w-10 lg:h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-3"></div>
                                            <p className="text-purple-300 font-medium text-sm lg:text-base">
                                                {gameStatus === 'waiting' ? 'Finding opponent...' : 'Connecting...'}
                                            </p>
                                            <p className="text-purple-400/70 text-xs lg:text-sm mt-1">
                                                Please wait while we match you with another player
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Game Timer - Compact */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
                                <h3 className="text-lg lg:text-xl font-bold text-white mb-3 flex items-center">
                                    <span className="text-lg lg:text-xl mr-2">⏱️</span>
                                    Timer
                                </h3>

                                <div className="space-y-2 lg:space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-white/5 to-purple-500/5 rounded-xl border border-white/10">
                                        <span className="text-gray-300 flex items-center">
                                            <span className="text-sm lg:text-lg mr-1 lg:mr-2">⏱️</span>
                                            <span className="hidden sm:inline">Game Time</span>
                                            <span className="sm:hidden">Time</span>
                                        </span>
                                        <span className="text-lg lg:text-2xl font-mono text-purple-400 font-bold">{formatTime(gameTime)}</span>
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
                                        {moveHistory.length === 0 ? (
                                            <div></div>
                                        ) :
                                            moveHistory.map((move, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="font-mono">{index + 1}.</span>
                                                    <span className="flex-1 text-center font-mono">{move.move.from} → {move.move.to}</span>
                                                    <span className="text-xs text-gray-400 font-mono">{new Date(move.moveTime).toLocaleTimeString()}</span>
                                                </div>
                                            ))
                                        }
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