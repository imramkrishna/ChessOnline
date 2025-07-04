import type { Color, PieceSymbol, Square } from 'chess.js';
import React from 'react'
import { useState } from 'react';
import { MOVE, GAME_OVER } from '../messages';

const ChessBoard = ({ board, socket, chess, setBoard, playerColor, gameStarted, currentTurn }: {
    chess: any;
    setBoard: (board: any) => void;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket | null
    playerColor: string;
    gameStarted: boolean;
    currentTurn: string;
}) => {
    if (!socket) return (
        <div className="flex items-center justify-center p-6 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/30">
            <div className="text-center">
                <div className="text-red-400 text-4xl mb-2">⚠️</div>
                <div className="text-red-400 font-bold">Connection Lost</div>
                <div className="text-red-300 text-sm">Socket connection is not established</div>
            </div>
        </div>
    );

    if (!gameStarted) return (
        <div className="flex items-center justify-center p-6 bg-yellow-500/10 backdrop-blur-sm rounded-2xl border border-yellow-500/30">
            <div className="text-center">
                <div className="text-yellow-400 text-4xl mb-2">⏳</div>
                <div className="text-yellow-400 font-bold">Waiting for Game</div>
                <div className="text-yellow-300 text-sm">Waiting for another player to join...</div>
            </div>
        </div>
    );

    const [from, setFrom] = useState<String | null>(null);
    const [to, setTo] = useState<String | null>(null);
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

    // Enhanced Chess piece Unicode symbols for better visibility
    const pieceSymbols: Record<string, string> = {
        'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
        'bp': '♟︎', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };

    const getPieceSymbol = (piece: { type: PieceSymbol; color: Color } | null): string => {
        if (!piece) return '';
        const key = `${piece.color}${piece.type}`;
        return pieceSymbols[key] || piece.type;
    };

    const handleSquareClick = (squareLabel: string) => {
        // Check if it's the player's turn
        const isPlayerTurn = (playerColor === 'white' && currentTurn === 'w') ||
            (playerColor === 'black' && currentTurn === 'b');

        if (!isPlayerTurn) {
            console.log("It's not your turn!");
            return;
        }

        if (!from) {
            // First click - select piece
            const piece = board.find(row =>
                row.find(cell => cell && cell.square === squareLabel)
            )?.find(cell => cell && cell.square === squareLabel);

            // Check if player is trying to select their own piece
            if (piece) {
                const pieceColor = piece.color === 'w' ? 'white' : 'black';
                if (pieceColor !== playerColor) {
                    console.log("You can only move your own pieces!");
                    return;
                }

                setFrom(squareLabel);
                setSelectedSquare(squareLabel);
                // Get possible moves for this piece
                try {
                    const moves = chess.moves({ square: squareLabel, verbose: true });
                    setPossibleMoves(moves.map((move: any) => move.to));
                } catch (error) {
                    setPossibleMoves([]);
                }
            }
        } else {
            // Second click - make move
            try {
                console.log(`Attempting move from ${from} to ${squareLabel}`);

                // Validate move before sending to server
                const move = chess.move({
                    from: from,
                    to: squareLabel,
                    promotion: 'q' // Always promote to queen for simplicity
                });

                if (move) {
                    // Send move to server
                    socket.send(JSON.stringify({
                        type: MOVE,
                        move: {
                            from: from,
                            to: squareLabel
                        }
                    }));
                    console.log("Move sent to server");
                } else {
                    console.log("Invalid move attempted");
                }
            } catch (error) {
                console.error("Invalid move:", error);
            } finally {
                setFrom(null);
                setTo(null);
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
        }
    };

    // Determine board orientation - flip for black player
    const isFlipped = playerColor === 'black';
    const files = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = isFlipped ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];

    return (
        <div className="flex flex-col items-center space-y-3 w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg">
            {/* File Labels (a-h) - Top */}
            <div className="grid grid-cols-8 gap-0 mb-1 w-full">
                {files.map((file) => (
                    <div key={file} className="flex items-center justify-center text-white/70 text-xs sm:text-sm md:text-base font-bold h-4 sm:h-5">
                        {file}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center">
                {/* Rank Labels (8-1) - Left */}
                <div className="flex flex-col gap-0 mr-1 sm:mr-2">
                    {ranks.map((rank) => (
                        <div key={rank} className="flex items-center justify-center text-white/70 text-xs sm:text-sm md:text-base font-bold w-4 sm:w-5 h-10 sm:h-12 md:h-14 lg:h-16">
                            {rank}
                        </div>
                    ))}
                </div>

                {/* Chess Board - Ultra Mobile Optimized */}
                <div className="relative bg-gradient-to-br from-amber-900 to-amber-800 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-2xl border-2 sm:border-4 border-amber-700/50">
                    <div className="grid grid-cols-8 gap-0 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                        {(isFlipped ? [...board].reverse() : board).map((row, rowIndex) => (
                            (isFlipped ? [...row].reverse() : row).map((cell, colIndex) => {
                                // Calculate the actual board position considering flipping
                                const actualRowIndex = isFlipped ? 7 - rowIndex : rowIndex;
                                const actualColIndex = isFlipped ? 7 - colIndex : colIndex;
                                const isLight = (actualRowIndex + actualColIndex) % 2 === 0;
                                const squareRepresentation = String.fromCharCode(97 + actualColIndex) + (8 - actualRowIndex);
                                const squareLabel = squareRepresentation.toLowerCase();
                                const isSelected = selectedSquare === squareLabel;
                                const isPossibleMove = possibleMoves.includes(squareLabel);

                                return (
                                    <div
                                        onClick={() => handleSquareClick(squareLabel)}
                                        key={`${actualRowIndex}-${actualColIndex}`}
                                        className={`
                                            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                                            flex items-center justify-center relative cursor-pointer
                                            transition-all duration-200 active:scale-95 touch-manipulation
                                            ${isLight
                                                ? 'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-stone-300'
                                                : 'bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700'
                                            }
                                            ${isSelected
                                                ? 'ring-2 sm:ring-3 ring-blue-500 ring-opacity-90 shadow-lg z-20'
                                                : ''
                                            }
                                        `}
                                        title={squareLabel}
                                    >
                                        {/* Chess Pieces - Simple and Centered */}
                                        {cell && (
                                            <span
                                                className={`
                                                    text-2xl sm:text-3xl md:text-4xl lg:text-5xl select-none font-bold
                                                    transition-all duration-200 hover:scale-105 z-30 relative
                                                    ${cell.color === 'w'
                                                        ? 'text-white'
                                                        : 'text-black'
                                                    }
                                                `}
                                                style={{
                                                    lineHeight: '1',
                                                    fontWeight: '700',
                                                    userSelect: 'none',
                                                    WebkitUserSelect: 'none',
                                                    MozUserSelect: 'none',
                                                    textShadow: cell.color === 'w'
                                                        ? '1px 1px 1px rgba(0,0,0,0.6)'
                                                        : '1px 1px 1px rgba(255,255,255,0.6)'
                                                }}
                                            >
                                                {getPieceSymbol(cell)}
                                            </span>
                                        )}

                                        {/* Move indicators - Clean and mobile-friendly */}
                                        {isPossibleMove && !cell && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-green-500/80 rounded-full shadow-sm"></div>
                                            </div>
                                        )}

                                        {/* Capture indicator - Clean and mobile-friendly */}
                                        {isPossibleMove && cell && (
                                            <div className="absolute inset-1 border-2 border-red-500/70 rounded-sm z-10"></div>
                                        )}

                                        {/* Square coordinates for debugging */}
                                        <div className={`
                                            absolute bottom-0 right-0 text-xs font-mono opacity-0 hover:opacity-60
                                            transition-opacity duration-200 pr-1 pb-1 hidden md:block
                                            ${isLight ? 'text-amber-800' : 'text-amber-100'}
                                        `}>
                                            {squareLabel}
                                        </div>
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                {/* Rank Labels (8-1) - Right */}
                <div className="flex flex-col gap-0 ml-1 sm:ml-2">
                    {ranks.map((rank) => (
                        <div key={rank} className="flex items-center justify-center text-white/70 text-xs sm:text-sm md:text-base font-bold w-4 sm:w-5 h-10 sm:h-12 md:h-14 lg:h-16">
                            {rank}
                        </div>
                    ))}
                </div>
            </div>

            {/* File Labels (a-h) - Bottom */}
            <div className="grid grid-cols-8 gap-0 mt-1 w-full">
                {files.map((file) => (
                    <div key={file} className="flex items-center justify-center text-white/70 text-xs sm:text-sm md:text-base font-bold h-4 sm:h-5">
                        {file}
                    </div>
                ))}
            </div>

            {/* Board Status - Mobile Optimized */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg px-3 py-2 border border-white/20 w-full shadow-lg">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-white/90 font-medium">Active</span>
                    </div>
                    {selectedSquare && (
                        <>
                            <div className="text-white/40">•</div>
                            <span className="text-white/90 font-medium">Selected: {selectedSquare.toUpperCase()}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Instructions - Always Visible */}
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-lg rounded-lg px-3 py-2 border border-purple-500/20 w-full shadow-lg">
                <div className="text-center">
                    <div className="text-white/90 text-sm font-bold mb-1 flex items-center justify-center">
                        <span className="mr-1 text-base">📱</span>
                        <span className="hidden sm:inline">How to Play</span>
                        <span className="sm:hidden">Instructions</span>
                    </div>
                    <div className="text-white/70 text-xs sm:text-sm">
                        <span className="hidden sm:inline">Tap a piece to select it, then tap destination square. Green dots show valid moves.</span>
                        <span className="sm:hidden">Tap piece → Tap destination</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChessBoard