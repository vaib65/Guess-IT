import http from "http"
import { Server } from "socket.io"
import dotenv from "dotenv"
import app from "./app.js"
import { registerMultiplayerHandlers } from "./socket/multiplayer.js"

dotenv.config();

const PORT = process.env.PORT || 3001;

//http server
const server = http.createServer(app)

//binding socket.io to http server
const io = new Server(server, {
    cors: {
        origin:"*"
    }
})

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  registerMultiplayerHandlers(io, socket);
});

server.listen(PORT, () => {
    console.log(`Server running on PORT:http://localhost:${PORT}`)
})

export { io, server };