import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
const wss = new WebSocketServer({ port: 8000 })
const gameManager = new GameManager();
wss.on("connection", function connection(ws) {
    console.log("New client connected");
    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
    gameManager.addUser(ws)
    ws.on("close", () => gameManager.removeUser(ws));
})