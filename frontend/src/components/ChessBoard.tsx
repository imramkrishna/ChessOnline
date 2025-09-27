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
        <div className="chess-board flex flex-col items-center space-y-3 w-full mx-auto overflow-safe">
            {/* File Labels (a-h) - Top */}
        <div className="grid grid-cols-8 gap-0 mb-1 w-full px-2">
                {files.map((file) => (
            <div key={file} className="flex items-center justify-center text-neutral-400 text-xs sm:text-sm md:text-base font-semibold h-4 sm:h-5 tracking-wide">
                        {file}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center w-full">
                {/* Rank Labels (8-1) - Left */}
        <div className="flex flex-col gap-0 mr-1 sm:mr-2 flex-shrink-0">
                    {ranks.map((rank) => (
            <div key={rank} className="flex items-center justify-center text-neutral-400 text-xs sm:text-sm md:text-base font-semibold w-4 sm:w-5 h-12 sm:h-14 md:h-16 lg:h-16">
                            {rank}
                        </div>
                    ))}
                </div>

        {/* Chess Board - Classic Style */}
        <div className="relative bg-[#8b6f47] p-2 rounded-md border border-[#6e5432] overflow-hidden select-none">
            <div className="grid grid-cols-8 gap-0 rounded-sm overflow-hidden">
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
                                            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                                            flex items-center justify-center relative cursor-pointer select-none
                                            transition-colors duration-150 touch-manipulation
                                            ${isLight
                                                ? 'bg-[#f0d9b5] hover:bg-[#f7e8cf]'
                                                : 'bg-[#b58863] hover:bg-[#c0926d]'
                                            }
                                            ${isSelected ? 'outline-2 outline-blue-500 z-10' : ''}
                                        `}
                                        title={squareLabel}
                                    >
                                        {/* Chess Pieces - Centered */}
                                        {cell && (
                                            <span
                                                className={`
                                                    text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold
                                                    ${cell.color === 'w' ? 'text-white' : 'text-black'}
                                                `}
                                                style={{
                                                    fontFamily: 'Segoe UI Symbol, Arial Unicode MS, "Noto Sans Symbols2", sans-serif',
                                                    lineHeight: '1',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {getPieceSymbol(cell)}
                                            </span>
                                        )}

                                        {/* Move indicators */}
                                        {isPossibleMove && !cell && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-green-400/90 rounded-full shadow-lg border-2 border-green-300/50 animate-pulse"></div>
                                            </div>
                                        )}

                                        {/* Capture indicator */}
                                        {isPossibleMove && cell && (
                                            <div className="absolute inset-1 border-3 border-red-400/80 rounded-md z-10 shadow-lg animate-pulse"></div>
                                        )}

                                        {/* Square coordinates (disabled for cleaner classic look) */}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                {/* Rank Labels (8-1) - Right */}
        <div className="flex flex-col gap-0 ml-1 sm:ml-2 flex-shrink-0">
                    {ranks.map((rank) => (
            <div key={rank} className="flex items-center justify-center text-neutral-400 text-xs sm:text-sm md:text-base font-semibold w-4 sm:w-5 h-12 sm:h-14 md:h-16 lg:h-16">
                            {rank}
                        </div>
                    ))}
                </div>
            </div>

            {/* File Labels (a-h) - Bottom */}
        <div className="grid grid-cols-8 gap-0 mt-1 w-full px-2">
                {files.map((file) => (
            <div key={file} className="flex items-center justify-center text-neutral-400 text-xs sm:text-sm md:text-base font-semibold h-4 sm:h-5 tracking-wide">
                        {file}
                    </div>
                ))}
            </div>

            {/* Board Status - Enhanced */}
            <div className="bg-neutral-800/30 backdrop-blur-xl rounded-md px-4 py-3 border border-neutral-700/40 w-full overflow-hidden">
                <div className="flex items-center justify-center space-x-3 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium tracking-wide">Game Active</span>
                    </div>
                    {selectedSquare && (
                        <>
                            <div className="text-white/30">•</div>
                            <span className="text-white font-medium bg-blue-500/20 px-2 py-1 rounded">
                                Selected: {selectedSquare.toUpperCase()}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Enhanced Instructions */}
            <div className="bg-neutral-800/30 backdrop-blur-xl rounded-md px-4 py-3 border border-neutral-700/40 w-full overflow-hidden">
                <div className="text-center">
                    <div className="text-white font-semibold mb-2 flex items-center justify-center text-sm tracking-wide">
                        <span className="mr-2 text-base">🎯</span>
                        <span className="hidden sm:inline">How to Play</span>
                        <span className="sm:hidden">Instructions</span>
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm leading-relaxed tracking-wide">
                        <span className="hidden sm:inline">
                            Select your piece, then choose destination. 
                            <span className="text-green-400 font-medium"> Green dots</span> = valid moves, 
                            <span className="text-red-400 font-medium"> Red border</span> = captures
                        </span>
                        <span className="sm:hidden">
                            Tap piece → Tap destination<br/>
                            <span className="text-green-400">●</span> = move, 
                            <span className="text-red-400">▢</span> = capture
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChessBoard