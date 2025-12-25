import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
const wss = new WebSocketServer({ port: Number(port) });
const gameManager = new GameManager();
wss.on("connection", function connection(ws) {
    console.log("New client connected");
    ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });
    gameManager.addUser(ws)
    ws.on("close", () => gameManager.removeUser(ws));
})