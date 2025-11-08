import { WebSocket } from "ws";
import { Chess } from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE,OFFERING_DRAW,RESIGN,IN_PROGRESS,DRAWED } from "./messages";
export interface moveType {
    from: string;
    to: string
}
export interface Moves{
    player: string,
    moveTime: Date,
    move: moveType
}
export interface GameStatus{
    gameSituation:typeof OFFERING_DRAW | typeof IN_PROGRESS | typeof DRAWED  | typeof RESIGN | typeof GAME_OVER
    offeredBy?:WebSocket
    offerTime?:Date
    offeredTo?:WebSocket
}
export class Game {
    public player1: WebSocket
    public player2: WebSocket
    private board: Chess
    private moves: Moves[]
    public gameStatus:GameStatus
    private startTime: Date

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.moves = []
        this.startTime = new Date()
        this.gameStatus={
            gameSituation:IN_PROGRESS
        }
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            },
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            },
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
             let newMove={
                player:"white",
                moveTime:new Date(),
                move:move
            }
            game.moves.push(newMove)
            this.player1.send(JSON.stringify({
                type: MOVE,
                move: move,
                board: this.board.fen(),
                turn: this.board.turn(),
                AllMoves:game.moves
            }));
            this.player2.send(JSON.stringify({
                type: MOVE,
                move: move,
                board: this.board.fen(),
                turn: this.board.turn(),
                AllMoves:game.moves
            }));
           
        }
        else {
            let newMove={
                player:"black",
                moveTime:new Date(),
                move:move
            }
            game.moves.push(newMove)
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
                board: this.board.fen(),
                turn: this.board.turn(),
                AllMoves:game.moves
            }));
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
                board: this.board.fen(),
                turn: this.board.turn(),
                AllMoves:game.moves
            }));
            
        }
    }

}
export default Game;