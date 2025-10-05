import {PrivateGame as Game} from "./PrivateGame";
import {INIT_GAME,RESIGN,IN_PROGRESS,OFFERING_DRAW,DRAWED,DRAW_ACCEPTED,DRAW_REJECTED,CREATE_ROOM,JOIN_ROOM} from "./messages";
import {WebSocket} from "ws";
import {MOVE} from "./messages";
import generatePrivateKey from "./utils/generatePrivateKey";
export class PrivateGameManager {
    private games: Game[]
    private pendingUsers: WebSocket | null
    private users: WebSocket[]
    public privateKey:String
    constructor() {
        this.games = []
        this.pendingUsers = null
        this.users = []
        this.privateKey=generatePrivateKey()
    }
    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
    }
    removeUser(socket: WebSocket) {
        this.users = this.users.filter(u => u !== socket)
    }
    public addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString())
            if (message.type === INIT_GAME) {
                if (this.pendingUsers) {
                    const game = new Game(this.pendingUsers, socket);
                    this.games.push(game)
                    this.pendingUsers = null;
                } else {
                    this.pendingUsers = socket
                }

            }
            if(message.type === CREATE_ROOM){
                const privateGameManager = new PrivateGameManager();
                privateGameManager.addUser(socket);
            }
            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket)
                if (!game) {
                    console.error("Game not found for the socket");
                    return;
                }
                if (game) {
                    game.makeMove(game, message.move);
                }
            }
            if (message.type === "game_over") {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket)
                if (game) {
                    game.player1.send(JSON.stringify({
                        type: "game_over",
                        message: "Game Over",
                        winner: message.winner
                    }));
                    game.player2.send(JSON.stringify({
                        type: "game_over",
                        message: "Game Over",
                        winner: message.winner
                    }));
                    this.games = this.games.filter(g => g !== game);
                }
            }
            if(message.type === RESIGN){
                const game=this.games.find(game=>game.player1===socket || game.player2===socket)
                if(game){
                    if(game.player1===socket){
                        game.player2.send(JSON.stringify({
                            type:"resign",
                        }))
                    }else{
                        game.player1.send(JSON.stringify({
                            type:"resign",
                        }))
                    }
                }
            }
            if(message.type === OFFERING_DRAW){
                const game=this.games.find(game=>game.player1===socket || game.player2===socket)
                if(game){
                    if(game.player1===socket){
                        game.gameStatus={
                            gameSituation:OFFERING_DRAW,
                            offeredBy:socket,
                            offeredTo:game.player2,
                            offerTime:new Date()
                        }
                        game.player2.send(JSON.stringify({
                            type:OFFERING_DRAW
                        }))
                    }else{
                        game.gameStatus={
                            gameSituation:OFFERING_DRAW,
                            offeredBy:socket,
                            offeredTo:game.player1,
                            offerTime:new Date()
                        }
                        game.player1.send(JSON.stringify({
                            type:OFFERING_DRAW
                        }))
                    }
                }
            }
            if(message.type === DRAW_ACCEPTED){
                const game=this.games.find(game=>game.player1===socket || game.player2===socket)
                if(game){
                    if(game.gameStatus.gameSituation===OFFERING_DRAW && game.gameStatus.offeredTo===socket){
                        game.gameStatus= {
                            gameSituation: DRAWED
                        }
                        game.player1.send(JSON.stringify({
                            type:DRAWED
                        }))
                        game.player2.send(JSON.stringify({
                            type:DRAWED
                        }))
                    }
                }
            }
            if(message.type === DRAW_REJECTED){
                const game=this.games.find(game=>game.player1===socket || game.player2===socket)
                if(game){
                    if(game.gameStatus.gameSituation===OFFERING_DRAW && game.gameStatus.offeredTo===socket){
                        game.gameStatus= {
                            gameSituation: IN_PROGRESS
                        }
                        game.player1.send(JSON.stringify({
                            type:DRAW_REJECTED
                        }))
                        game.player2.send(JSON.stringify({
                            type:DRAW_REJECTED
                        }))
                    }
                }
            }

        })
    }
}