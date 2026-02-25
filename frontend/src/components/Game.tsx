import React, { useEffect, useState } from 'react'
import ChessBoard from './ChessBoard'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket';
import { INIT_GAME, MOVE, GAME_OVER, RESIGN, OFFERING_DRAW, DRAW_ACCEPTED,DRAWED, DRAW_REJECTED } from '../messages';
import { Chess } from 'chess.js';
import VictoryMessage from './VictoryMessage';
import DefeatMessage from './DefeatMessage';
import OfferDrawMessage from './OfferDrawMessage';
import DrawResultMessage from './DrawResultMessage';
import PendingDrawMessage from './PendingDrawMessage';
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
    const [showVictoryMessage, setShowVictoryMessage] = useState<boolean>(false);
    const [showDefeatMessage, setShowDefeatMessage] = useState<boolean>(false);
    const [showDrawOffer, setShowDrawOffer] = useState<boolean>(false);
    const [showDrawResult, setShowDrawResult] = useState<boolean>(false);
    const [pendingDraw,setPendingDraw]=useState<boolean>(false)
    const navigate = useNavigate();
    const socket = useSocket();
    const hasResult = showVictoryMessage || showDefeatMessage;
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
                setShowDefeatMessage(true);
            } catch (err) {
                console.error("Failed to send resign message:", err)
            }
        } else {
            console.warn("Socket not connected, cannot resign.")
            navigate("/")
        }
    }
    const handleLeaveGame = () => {
        setShowVictoryMessage(false);
        setShowDefeatMessage(false);
        setGameStarted(false);
        setGameStatus('waiting');
        setPlayerColor('');
        console.log('Leaving game...');
        socket?.send(JSON.stringify({ type: GAME_OVER }));
    };
    const handleDraw = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(JSON.stringify({ type: OFFERING_DRAW }))
                setPendingDraw(true)
            } catch (err) {
                console.error("Failed to send draw offer:", err)
            }
        } else {
            console.warn("Socket not connected, cannot offer draw.")
            navigate("/")
        }
    }
    const handleGoHome = () => {
        handleLeaveGame();
        navigate('/');
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
                    setShowVictoryMessage(true);
                    setGameStarted(false);
                    setGameStatus('ended');
                    console.log("Opponent resigned. You win!");
                    break;
                case OFFERING_DRAW:
                    setShowDrawOffer(true);
                    break;
                case DRAWED:
                    setPendingDraw(false);
                    setShowDrawResult(true)
                    handleLeaveGame()
                    break;
                case DRAW_REJECTED:
                    setPendingDraw(false);
                    break;    
                default:
                    console.log("Invalid message")
            }
        }
    }, [socket])
    const acceptDraw=() => {
        setShowDrawOffer(false);
        setGameStarted(false);
        setGameStatus('ended');
        socket?.send(JSON.stringify({type:DRAW_ACCEPTED}))
    }
    const rejectDraw=()=>{
        setShowDrawOffer(false);
        socket?.send(JSON.stringify({type:DRAW_REJECTED}))
    }
    return (
        <div className="min-h-screen bg-[#e8e5e0] relative">
            {
                hasResult && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
                        <div className="relative z-10 w-full max-w-lg">
                            {showVictoryMessage && (
                                <VictoryMessage
                                    onGoHome={handleGoHome}
                                    onClose={() => setShowVictoryMessage(false)}
                                />
                            )}
                            {showDefeatMessage && (
                                <DefeatMessage
                                    onGoHome={handleGoHome}
                                    onClose={() => setShowDefeatMessage(false)}
                                />
                            )}
                        </div>
                    </div>
                )}
                {
                showDrawOffer && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
                        <div className="relative z-10 w-full max-w-lg">
                            <OfferDrawMessage
                                onAccept={acceptDraw}
                                onReject={rejectDraw}
                                onOpen={() => setShowDrawOffer(true)}
                                onClose={() => {
                                    setShowDrawOffer(false)
                                }}
                            />
                        </div>
                    </div>
                )}
                {
                    showDrawResult &&(
                          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
                        <div className="relative z-10 w-full max-w-lg">
                            <DrawResultMessage
                                handleGoHome={handleGoHome}
                                message="accepted"
                                onOpen={() => setShowDrawOffer(true)}
                                onClose={() => {
                                    setShowDrawOffer(false)
                                }}
                            />
                        </div>
                    </div>
                    )
                }
                {
                    showDrawResult &&(
                          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
                        <div className="relative z-10 w-full max-w-lg">
                            <DrawResultMessage
                                handleGoHome={handleGoHome}
                                message="accepted"
                                onOpen={() => setShowDrawOffer(true)}
                                onClose={() => {
                                    setShowDrawOffer(false)
                                }}
                            />
                        </div>
                    </div>
                    )
                }
                {
                    pendingDraw &&(
                          <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
                        <div className="relative z-10 w-full max-w-lg">
                            <PendingDrawMessage
                                onOpen={() => setShowDrawOffer(true)}
                                onClose={() => {
                                    setShowDrawOffer(false)
                                }}
                            />
                        </div>
                    </div>
                    )
                }
                <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>
            {/* Enhanced Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-black/[0.02] rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/[0.02] rounded-full blur-3xl"></div>

                {/* Floating chess pieces - subtle */}
                <div className="absolute top-10 left-10 text-4xl text-black/[0.03] select-none">♔</div>
                <div className="absolute top-20 right-20 text-3xl text-black/[0.03] select-none">♛</div>
                <div className="absolute bottom-20 left-20 text-3xl text-black/[0.03] select-none">♜</div>
                <div className="absolute bottom-10 right-10 text-4xl text-black/[0.03] select-none">♞</div>
            </div>

            <div className="relative z-10 p-2 sm:p-4 lg:p-8 w-full">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="text-center mb-6 lg:mb-8 px-2">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1a1a] mb-1 tracking-tight">
                            CHESS<span className="font-light italic text-[#c84032]" style={{ fontFamily: 'Georgia, serif' }}> Game</span>
                        </h1>
                        <p className="text-[#888] text-sm">Live Chess Battle Arena</p>
                    </div>

                    {/* Main Game Area - Responsive */}
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full items-start">
                        {/* Chess Board - Responsive Container */}
                        <div className="w-full lg:flex-1 lg:min-w-0 order-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 border border-black/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.06)] w-full">
                                <div className="text-center mb-3 lg:mb-6">
                                    <h3 className="text-xl lg:text-2xl font-bold mb-1 lg:mb-2 text-[#1a1a1a]">
                                        Game Board
                                    </h3>
                                    <p className="text-[#666] text-sm lg:text-base font-medium">
                                        {gameStarted ? (
                                            <span className="flex items-center justify-center space-x-2">
                                                <span>Playing as</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${playerColor === 'white'
                                                    ? 'bg-[#f5f5f5] text-[#1a1a1a] border border-black/10 shadow-sm'
                                                    : 'bg-[#1a1a1a] text-white shadow-sm'
                                                    }`}>
                                                    {playerColor}
                                                </span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center space-x-2">
                                                <div className="w-2 h-2 bg-[#c84032] rounded-full animate-pulse"></div>
                                                <span>Searching for opponent...</span>
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Chess Board Component */}
                                <div className="flex justify-center mb-3 lg:mb-4 w-full overflow-hidden">
                                    <div className="w-full max-w-[560px] mx-auto">
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

                                {/* Turn Indicator */}
                                <div className="flex justify-center">
                                    <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-6 bg-[#f5f5f3] backdrop-blur-lg rounded-xl px-3 lg:px-6 py-2 lg:py-3 text-xs sm:text-sm lg:text-base border border-black/[0.06] shadow-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full shadow-sm ${gameStarted
                                                ? 'bg-emerald-500 animate-pulse'
                                                : 'bg-[#c84032] animate-pulse'
                                                }`}></div>
                                            <span className="text-[#888] font-medium">Turn:</span>
                                            <span className={`font-bold px-2 py-1 rounded-md ${currentTurn === 'w'
                                                ? 'bg-[#f5f5f5] text-[#1a1a1a] border border-black/10'
                                                : 'bg-[#1a1a1a] text-white'
                                                }`}>
                                                {currentTurn === 'w' ? 'White' : 'Black'}
                                            </span>
                                            {gameStarted && (
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${(playerColor === 'white' && currentTurn === 'w') || (playerColor === 'black' && currentTurn === 'b')
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-red-50 text-[#c84032] border border-red-200'
                                                    }`}>
                                                    {(playerColor === 'white' && currentTurn === 'w') || (playerColor === 'black' && currentTurn === 'b')
                                                        ? 'Your Turn'
                                                        : 'Opponent\'s Turn'
                                                    }
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-px h-5 lg:h-7 bg-black/10"></div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[#888] font-medium">Move:</span>
                                            <span className="font-bold text-[#1a1a1a] text-xl">
                                                {moveCount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Control Panel */}
                        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-3 lg:space-y-4 order-2 overflow-hidden">
                            {/* Game Status Card */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-6 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                                <h2 className="text-xl lg:text-2xl font-bold text-[#1a1a1a] mb-4 flex items-center">
                                    <span className="text-2xl lg:text-3xl mr-3">♚</span>
                                    <span>Game Status</span>
                                </h2>

                                <div className="space-y-4">
                                    {/* Status Indicator */}
                                    <div className="flex items-center space-x-3 p-3 lg:p-4 bg-[#f5f5f3] rounded-xl border border-black/[0.04]">
                                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full shadow-sm ${gameStatus === 'playing' ? 'bg-emerald-500 animate-pulse' :
                                            gameStatus === 'waiting' ? 'bg-amber-400 animate-pulse' : 'bg-[#c84032]'
                                            }`}></div>
                                        <span className="text-[#1a1a1a] font-semibold text-sm lg:text-base">
                                            {gameStatus === 'playing' ? 'Game Active' :
                                                gameStatus === 'waiting' ? 'Waiting for Player' : 'Game Ended'}
                                        </span>
                                    </div>

                                    {/* Player Info */}
                                    <div className="bg-[#f5f5f3] rounded-xl p-3 lg:p-4 space-y-3 border border-black/[0.04] overflow-hidden">
                                        <div className="flex justify-between items-center min-w-0">
                                            <span className="text-[#555] flex items-center text-sm lg:text-base font-medium flex-shrink-0">
                                                <span className="text-lg lg:text-xl mr-2">👤</span>
                                                You
                                            </span>
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                {playerColor && (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${playerColor === 'white'
                                                        ? 'bg-[#f5f5f5] text-[#1a1a1a] border border-black/10'
                                                        : 'bg-[#1a1a1a] text-white'
                                                        }`}>
                                                        {playerColor}
                                                    </span>
                                                )}
                                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${gameStarted ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
                                                    }`}></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center min-w-0">
                                            <span className="text-[#555] flex items-center text-sm lg:text-base font-medium flex-shrink-0">
                                                <span className="text-lg lg:text-xl mr-2">👤</span>
                                                Opponent
                                            </span>
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                {gameStarted ? (
                                                    <>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap ${playerColor === 'white'
                                                            ? 'bg-[#1a1a1a] text-white'
                                                            : 'bg-[#f5f5f5] text-[#1a1a1a] border border-black/10'
                                                            }`}>
                                                            {playerColor === 'white' ? 'black' : 'white'}
                                                        </span>
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-[#888] px-2 py-1 bg-white rounded-md whitespace-nowrap border border-black/[0.06]">
                                                        Searching...
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Game Controls */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                                <h3 className="text-lg lg:text-xl font-bold text-[#1a1a1a] mb-3 flex items-center">
                                    <span className="text-lg lg:text-xl mr-2">⚙</span>
                                    <span>Controls</span>
                                </h3>

                                <div className="space-y-2 lg:space-y-3">
                                    {gameStarted ? (
                                        <>
                                            <button
                                                onClick={handleResign}
                                                className="group w-full bg-[#f5f5f3] hover:bg-[#eee] text-[#1a1a1a] font-semibold py-2 lg:py-3 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 border border-black/[0.06] relative overflow-hidden">
                                                <div className="relative flex items-center justify-center space-x-1 lg:space-x-2">
                                                    <span className="text-lg">🚪</span>
                                                    <span className="text-sm lg:text-base">Leave Game</span>
                                                </div>
                                            </button>

                                            <div className="grid grid-cols-2 gap-2 lg:gap-3">
                                                <button
                                                onClick={handleDraw}
                                                 className="group bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold py-2 px-2 lg:px-3 rounded-lg transition-all duration-300 relative overflow-hidden">
                                                    <div className="relative flex flex-col items-center justify-center space-y-1">
                                                        <span className="text-lg">🤝</span>
                                                        <span className="text-xs lg:text-sm">Draw</span>
                                                    </div>
                                                </button>

                                                <button className="group bg-[#c84032] hover:bg-[#b5372a] text-white font-semibold py-2 px-2 lg:px-3 rounded-lg transition-all duration-300 relative overflow-hidden"
                                                    onClick={() => handleResign()}
                                                >
                                                    <div className="relative flex flex-col items-center justify-center space-y-1">
                                                        <span className="text-lg">🏳️</span>
                                                        <span className="text-xs lg:text-sm">Resign</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4 lg:py-6">
                                            <div className="animate-spin w-8 h-8 lg:w-10 lg:h-10 border-4 border-black/10 border-t-[#1a1a1a] rounded-full mx-auto mb-3"></div>
                                            <p className="text-[#1a1a1a] font-medium text-sm lg:text-base">
                                                {gameStatus === 'waiting' ? 'Finding opponent...' : 'Connecting...'}
                                            </p>
                                            <p className="text-[#888] text-xs lg:text-sm mt-1">
                                                Please wait while we match you with another player
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Game Timer */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                                <h3 className="text-lg lg:text-xl font-bold text-[#1a1a1a] mb-3 flex items-center">
                                    <span className="text-lg lg:text-xl mr-2">⏱</span>
                                    Timer
                                </h3>

                                <div className="space-y-2 lg:space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-[#f5f5f3] rounded-xl border border-black/[0.04]">
                                        <span className="text-[#888] flex items-center">
                                            <span className="hidden sm:inline">Game Time</span>
                                            <span className="sm:hidden">Time</span>
                                        </span>
                                        <span className="text-lg lg:text-2xl font-mono text-[#1a1a1a] font-bold">{formatTime(gameTime)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Move History */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)] hidden lg:block">
                                <h3 className="text-lg lg:text-xl font-bold text-[#1a1a1a] mb-3 flex items-center">
                                    <span className="text-lg lg:text-xl mr-2">📋</span>
                                    History
                                </h3>

                                <div className="max-h-24 lg:max-h-32 overflow-y-auto text-sm text-[#555] bg-[#f5f5f3] rounded-lg p-2 lg:p-3">
                                    <div className="space-y-1 lg:space-y-2">
                                        {moveHistory.length === 0 ? (
                                            <div></div>
                                        ) :
                                            moveHistory.map((move, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="font-mono">{index + 1}.</span>
                                                    <span className="flex-1 text-center font-mono">{move.move.from} → {move.move.to}</span>
                                                    <span className="text-xs text-[#aaa] font-mono">{new Date(move.moveTime).toLocaleTimeString()}</span>
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
                            className="group bg-white/80 hover:bg-white text-[#1a1a1a] px-6 py-3 rounded-xl transition-all duration-300 border border-black/[0.06] hover:shadow-md"
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