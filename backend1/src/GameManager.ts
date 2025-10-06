import {WebSocket} from "ws"
import generatePrivateKey from "./utils/generatePrivateKey";
import {
    CREATE_ROOM,
    DRAW_ACCEPTED,
    DRAW_REJECTED,
    DRAWED, ERROR,
    IN_PROGRESS,
    INIT_GAME, JOIN_ROOM,
    MOVE,
    OFFERING_DRAW,
    RESIGN, ROOM_CREATED, ROOM_JOINED
} from "./messages"
import Game from "./Game"
interface PendingPrivateUsers{
    player1: WebSocket,
    privateKey:String | null,
    player2?: WebSocket,
}
export class GameManager {
    private games: Game[]
    private pendingUsers: WebSocket | null
    private users: WebSocket[]
    public pendingPrivateUsers:PendingPrivateUsers[]
    constructor() {
        this.games = []
        this.pendingUsers = null
        this.users = []
        this.pendingPrivateUsers=[];
    }
    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
    }
    removeUser(socket: WebSocket) {
        this.users = this.users.filter(u => u !== socket)
    }
    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString())
            if(message.type === CREATE_ROOM) {
                const newPlayer= {
                    player1: socket,
                    privateKey: generatePrivateKey()
                }
                this.pendingPrivateUsers.push(newPlayer)
                socket.send(JSON.stringify({
                    type:ROOM_CREATED,
                    roomID:newPlayer.privateKey
                }))
            }
            if(message.type === JOIN_ROOM) {
                const privateKey=message.roomID
                const room=this.pendingPrivateUsers.find(u=>u.privateKey === privateKey)
                if(room){
                    const game=new Game(room.player1,socket)
                    this.games.push(game)
                    this.pendingPrivateUsers.filter(u=>u.privateKey === privateKey)
                    game.player1.send(JSON.stringify({
                        type:ROOM_JOINED,
                        roomID:privateKey,
                        payload:{
                            color:"white"
                        }
                    }))
                    game.player2.send(JSON.stringify({
                        type:ROOM_JOINED,
                        roomID:privateKey,
                        payload:{
                            color:"black"
                        }
                    }))
                }
                else{
                    socket.send(JSON.stringify({
                        type:ERROR,
                        message:"Invalid Room ID"
                    }))
                }
            }
            if (message.type === INIT_GAME) {
                if (this.pendingUsers) {
                    const game = new Game(this.pendingUsers, socket);
                    this.games.push(game)
                    this.pendingUsers = null;
                } else {
                    this.pendingUsers = socket
                }

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