import express, { Express } from "express";
import { Socket, Server as IOServer} from "socket.io";
import io from "socket.io"
import { createServer, Server } from "http";
import initializeRouters from "./routers";
import { config } from "dotenv";
import OpenAiService from "./OpenAiService";

const initServer = () => {
    
    const app : Express = express()
    const server : Server = createServer(app)
    const ioServer = new IOServer(server)
    
    ioServer.of('/generate').on('connection', (socket : Socket) => {
        console.log("Connected")
        initializeRouters(socket)
    })
    app.use(express.static('public'))
    console.log("Listening on 8000")
    server.listen(8000)
    
}
config()
initServer()