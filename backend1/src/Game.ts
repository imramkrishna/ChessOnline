import { WebSocket } from "ws";
import { Chess } from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { Redis } from '@upstash/redis';
const redis = new Redis({
    url: 'https://ethical-pegasus-10842.upstash.io',
    token: 'ASpaAAIjcDE5NDA1ZDdmMWYyYTQ0NTZkOGRhMjlkOGQ0YTg4ZjExZnAxMA',
})
interface moveType {
    from: string;
    to: string
}
export class Game {
    public player1: WebSocket
    public player2: WebSocket
    private board: Chess
    private moves: string[]
    private startTime: Date
    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.moves = []
        this.startTime = new Date()
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));

    }
    makeMove(game: Game, move: moveType) {
        try {
            console.log("Making move:", move);
            game.board.move(move)
        } catch (e) {
            console.error("Invalid move attempted:", move);
            return;
        }
        if (game.board.isGameOver()) {
            game.player1.send(JSON.stringify({
                type: GAME_OVER,
                message: "Game Over",
                winner: game.board.turn() === 'w' ? 'Black' : 'White'
            }));
            return;
        }
        if (this.board.moves.length % 2 == 0) {
            this.player1.send(JSON.stringify({
                type: MOVE,
                move: move,
                board: this.board.fen(),
                turn: this.board.turn()
            }));
            this.player2.send(JSON.stringify({
                type: MOVE,
                move: move,
                board: this.board.fen(),
                turn: this.board.turn()
            }));
        }
        else {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
                board: this.board.fen(),
                turn: this.board.turn()
            }));
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
                board: this.board.fen(),
                turn: this.board.turn()
            }));
        }
        this.moves.push(JSON.stringify(move));
    }

}