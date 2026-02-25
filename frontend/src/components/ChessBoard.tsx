import type { Color, PieceSymbol, Square } from 'chess.js';
import React, { useRef, useCallback, useEffect } from 'react'
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
        <div className="flex items-center justify-center p-6 bg-red-50 backdrop-blur-sm rounded-2xl border border-red-200">
            <div className="text-center">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <div className="text-red-600 font-bold">Connection Lost</div>
                <div className="text-red-400 text-sm">Socket connection is not established</div>
            </div>
        </div>
    );

    if (!gameStarted) return (
        <div className="flex items-center justify-center p-6 bg-amber-50 backdrop-blur-sm rounded-2xl border border-amber-200">
            <div className="text-center">
                <div className="text-amber-500 text-4xl mb-2">⏳</div>
                <div className="text-amber-700 font-bold">Waiting for Game</div>
                <div className="text-amber-500 text-sm">Waiting for another player to join...</div>
            </div>
        </div>
    );

    const [from, setFrom] = useState<String | null>(null);
    const [to, setTo] = useState<String | null>(null);
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const boardRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
        };
        if (isFullscreen) {
            document.documentElement.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKey);
        }
        return () => {
            document.documentElement.style.overflow = '';
            window.removeEventListener('keydown', handleKey);
        };
    }, [isFullscreen]);

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

    // Board rendering extracted so it can be placed in normal or fullscreen container
    const renderBoard = (inFullscreen: boolean) => (
        <div className={`chess-board flex flex-col items-center mx-auto gap-1 sm:gap-2 w-full`}>
            {/* Board with labels */}
            <div className="flex flex-col gap-1 sm:gap-2 w-full">
                {/* File Labels (a-h) - Top */}
                <div className="flex w-full">
                    <div className="w-5 sm:w-7 flex-shrink-0 mr-1 sm:mr-2" />
                    <div className="flex-1 grid grid-cols-8">
                        {files.map((file) => (
                            <div key={file} className="flex items-center justify-center text-[#999] text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide">
                                {file}
                            </div>
                        ))}
                    </div>
                    <div className="w-5 sm:w-7 flex-shrink-0 ml-1 sm:ml-2" />
                </div>

                <div className="flex w-full">
                    {/* Rank Labels - Left */}
                    <div className="flex flex-col mr-1 sm:mr-2 flex-shrink-0">
                        {ranks.map((rank) => (
                            <div key={rank} className="flex-1 flex items-center justify-center text-[#999] text-[10px] sm:text-xs md:text-sm font-semibold w-5 sm:w-7">
                                {rank}
                            </div>
                        ))}
                    </div>

                    {/* Chess Board Grid */}
                    <div className="flex-1 bg-[#6e5432] rounded-md overflow-hidden select-none">
                        {(isFlipped ? [...board].reverse() : board).map((row, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="flex">
                                {(isFlipped ? [...row].reverse() : row).map((cell, colIndex) => {
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
                                                flex-1 aspect-square flex items-center justify-center relative cursor-pointer select-none
                                                ${isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}
                                                ${isSelected ? 'ring-2 ring-blue-400 ring-inset' : ''}
                                            `}
                                            title={squareLabel}
                                        >
                                            {cell && (
                                                <span
                                                    className={`
                                                        ${inFullscreen ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-2xl md:text-3xl'} font-semibold
                                                        select-none pointer-events-none
                                                        ${cell.color === 'w' ? 'text-white' : 'text-black'}
                                                    `}
                                                    style={{
                                                        fontFamily: 'Segoe UI Symbol, Arial Unicode MS, "Noto Sans Symbols2", sans-serif',
                                                        lineHeight: '1',
                                                        textShadow: cell.color === 'w'
                                                            ? '1px 1px 1px rgba(0, 0, 0, 0.3)'
                                                            : '1px 1px 1px rgba(255, 255, 255, 0.2)'
                                                    }}
                                                >
                                                    {getPieceSymbol(cell)}
                                                </span>
                                            )}

                                            {isPossibleMove && !cell && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                                    <div className="w-4 h-4 bg-green-400/90 rounded-full shadow-sm border border-green-300/50"></div>
                                                </div>
                                            )}

                                            {isPossibleMove && cell && (
                                                <div className="absolute inset-0.5 rounded-sm ring-2 ring-inset ring-red-400/80 pointer-events-none shadow-sm"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Rank Labels - Right */}
                    <div className="flex flex-col ml-1 sm:ml-2 flex-shrink-0">
                        {ranks.map((rank) => (
                            <div key={rank} className="flex-1 flex items-center justify-center text-[#999] text-[10px] sm:text-xs md:text-sm font-semibold w-5 sm:w-7">
                                {rank}
                            </div>
                        ))}
                    </div>
                </div>

                {/* File Labels (a-h) - Bottom */}
                <div className="flex w-full">
                    <div className="w-5 sm:w-7 flex-shrink-0 mr-1 sm:mr-2" />
                    <div className="flex-1 grid grid-cols-8">
                        {files.map((file) => (
                            <div key={file} className="flex items-center justify-center text-[#999] text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide">
                                {file}
                            </div>
                        ))}
                    </div>
                    <div className="w-5 sm:w-7 flex-shrink-0 ml-1 sm:ml-2" />
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Fullscreen overlay — rendered as a sibling, not wrapping the board */}
            {isFullscreen && (
                <div
                    ref={boardRef}
                    className="fixed inset-0 z-50 bg-[#e8e5e0]"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                    {/* Close button — top-right */}
                    <div style={{ width: 'min(88vw, 88vh)' }} className="flex justify-end mb-2">
                        <button
                            onClick={toggleFullscreen}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/80 hover:bg-white border border-black/10 text-[#555] hover:text-[#1a1a1a] text-sm shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="4 14 10 14 10 20" />
                                <polyline points="20 10 14 10 14 4" />
                                <line x1="14" y1="10" x2="21" y2="3" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                            <span className="hidden sm:inline">Exit Fullscreen</span>
                            <span className="sm:hidden">Exit</span>
                        </button>
                    </div>

                    {/* Board — sized to fit viewport */}
                    <div style={{ width: 'min(88vw, 88vh)' }}>
                        {renderBoard(true)}
                    </div>
                </div>
            )}

            {/* Normal inline board */}
            <div ref={!isFullscreen ? boardRef : undefined} className="flex flex-col items-center mx-auto gap-1 sm:gap-2 w-full">
                {/* Fullscreen toggle */}
                <div className="flex w-full justify-end mb-1">
                    <button
                        onClick={toggleFullscreen}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/[0.06] hover:bg-black/[0.1] border border-black/[0.08] text-[#555] hover:text-[#1a1a1a] text-xs sm:text-sm"
                        title="Fullscreen board"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9" />
                            <polyline points="9 21 3 21 3 15" />
                            <line x1="21" y1="3" x2="14" y2="10" />
                            <line x1="3" y1="21" x2="10" y2="14" />
                        </svg>
                        <span className="hidden sm:inline">Fullscreen</span>
                    </button>
                </div>

                {renderBoard(false)}

                {/* Board Status */}
                <div className="bg-[#f5f5f3] rounded-md px-3 py-2 sm:px-4 sm:py-3 border border-black/[0.06] w-full">
                    <div className="flex items-center justify-center space-x-3 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[#1a1a1a] font-medium tracking-wide">Game Active</span>
                        </div>
                        {selectedSquare && (
                            <>
                                <div className="text-black/20">•</div>
                                <span className="text-[#1a1a1a] font-medium bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                    Selected: {selectedSquare.toUpperCase()}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-[#f5f5f3] rounded-md px-3 py-2 sm:px-4 sm:py-3 border border-black/[0.06] w-full">
                    <div className="text-center">
                        <div className="text-[#1a1a1a] font-semibold mb-1 flex items-center justify-center text-xs sm:text-sm tracking-wide">
                            <span className="mr-1 sm:mr-2 text-sm sm:text-base">🎯</span>
                            <span>How to Play</span>
                        </div>
                        <div className="text-[#666] text-[10px] sm:text-xs leading-relaxed tracking-wide">
                            Select piece → choose destination.
                            <span className="text-emerald-600 font-medium"> Green dots</span> = moves,
                            <span className="text-red-500 font-medium"> Red border</span> = captures
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChessBoard