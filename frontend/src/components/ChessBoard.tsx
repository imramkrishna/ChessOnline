import type { Color, PieceSymbol, Square } from 'chess.js';
import React from 'react'
import { useState } from 'react';
import { MOVE, GAME_OVER } from '../messages';
const ChessBoard = ({ board, socket }: {

    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket | null
}) => {
    if (!socket) return <div className="text-red-500">Socket connection is not established.</div>;
    const [from, setFrom] = useState<String | null>(null);
    const [to, setTo] = useState<String | null>(null);
    // Chess piece Unicode symbols
    const pieceSymbols: Record<string, string> = {
        'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
        'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };

    const getPieceSymbol = (piece: { type: PieceSymbol; color: Color } | null): string => {
        if (!piece) return '';
        const key = `${piece.color}${piece.type}`;
        return pieceSymbols[key] || piece.type;
    };

    const getSquareLabel = (rowIndex: number, colIndex: number): string => {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        return `${files[colIndex]}${ranks[rowIndex]}`;
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Board Container */}
            <div className="relative">
                {/* File Labels (a-h) - Top */}
                <div className="grid grid-cols-8 gap-0 mb-1">
                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file) => (
                        <div key={file} className="w-16 h-6 flex items-center justify-center text-white/60 text-sm font-semibold">
                            {file}
                        </div>
                    ))}
                </div>

                <div className="flex">
                    {/* Rank Labels (8-1) - Left */}
                    <div className="flex flex-col gap-0 mr-1">
                        {['8', '7', '6', '5', '4', '3', '2', '1'].map((rank) => (
                            <div key={rank} className="w-6 h-16 flex items-center justify-center text-white/60 text-sm font-semibold">
                                {rank}
                            </div>
                        ))}
                    </div>

                    {/* Chess Board */}
                    <div className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden shadow-2xl border-4 border-amber-900/50">
                        {board.map((row, rowIndex) => (
                            row.map((cell, colIndex) => {
                                const isLight = (rowIndex + colIndex) % 2 === 0;
                                const squareLabel = getSquareLabel(rowIndex, colIndex);

                                return (
                                    <div
                                        onClick={() => {
                                            if (from && to) {
                                                // Handle move logic here
                                                console.log(`Move from ${from} to ${to}`);
                                                const response = socket.send(JSON.stringify({
                                                    type: MOVE,
                                                    move: {
                                                        from: from,
                                                        to: to
                                                    }
                                                }))
                                                console.log("Response: ", response)
                                                setFrom(null);
                                                setTo(null);
                                            } else if (from) {
                                                // Set destination square
                                                setTo(squareLabel);
                                            } else {
                                                // Set source square
                                                setFrom(squareLabel);
                                            }

                                        }}
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`
                                            w-16 h-16 flex items-center justify-center relative cursor-pointer
                                            transition-all duration-200 hover:brightness-110
                                            ${isLight
                                                ? 'bg-teal-200 hover:bg-teal-200'
                                                : 'bg-amber-800 hover:bg-amber-700'
                                            }
                                        `}
                                        title={squareLabel}
                                    >
                                        {/* Piece */}
                                        {cell && (
                                            <span
                                                className={`
                                                    text-4xl select-none transition-all duration-200
                                                    hover:scale-110 drop-shadow-md
                                                    ${cell.color === 'w' ? 'text-gray-100' : 'text-gray-800'}
                                                `}
                                            >
                                                {getPieceSymbol(cell)}
                                            </span>
                                        )}

                                        {/* Square coordinates (only visible on hover) */}
                                        <div className={`
                                            absolute bottom-0 right-0 text-xs font-mono opacity-0 hover:opacity-30
                                            ${isLight ? 'text-amber-800' : 'text-amber-100'}
                                        `}>
                                            {squareLabel}
                                        </div>

                                        {/* Highlight overlay for selected/possible moves */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            {/* Add conditional highlights here later */}
                                        </div>
                                    </div>
                                );
                            })
                        ))}
                    </div>

                    {/* Rank Labels (8-1) - Right */}
                    <div className="flex flex-col gap-0 ml-1">
                        {['8', '7', '6', '5', '4', '3', '2', '1'].map((rank) => (
                            <div key={rank} className="w-6 h-16 flex items-center justify-center text-white/60 text-sm font-semibold">
                                {rank}
                            </div>
                        ))}
                    </div>
                </div>

                {/* File Labels (a-h) - Bottom */}
                <div className="grid grid-cols-8 gap-0 mt-1">
                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file) => (
                        <div key={file} className="w-16 h-6 flex items-center justify-center text-white/60 text-sm font-semibold">
                            {file}
                        </div>
                    ))}
                </div>
            </div>

            {/* Board Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-white/80">Board Active</span>
                    </div>
                    <div className="text-white/60">•</div>
                    <span className="text-white/80">512x512px</span>
                    <div className="text-white/60">•</div>
                    <span className="text-white/80">Interactive</span>
                </div>
            </div>
        </div>
    )
}

export default ChessBoard