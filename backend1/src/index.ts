import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8000 })

wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        console.log("Received: ", data)
    })
    ws.send("something")
})