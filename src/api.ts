import express from "express";
import {Router} from "express";
import * as http from "http";
import * as socketio from "socket.io";

export interface IApiRouter {
    route: string;
    Routes: (ioServer: socketio.Server) => Router;
}

export class Api {

    Start (routers: Array<IApiRouter>): void {
        const api = express();
        // this replaces using body-parser in express 4.16
        api.use(express.json());
        api.use(express.urlencoded({extended: true}));
        //api.use(bodyParser.json()); // support json encoded bodies
        //api.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

        // allow CORS
        api.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
          });


        api.get("/api", (req, res) => {
            return res.send("Hello from the API");

        });

        // set up the server and socket.io

        let httpServer = new http.Server(api);

        let io = socketio.listen(httpServer);

        io.on("connection", (socket: any) => {
            console.log(`a user connected`);

            socket.on("message", (message: any) => {
                console.log(`Received message: ${message}`);
                io.emit("message", "Back at you");
            });
        });

        // add the routes for each router
        routers.map((router) => {
            api.use(router.route, router.Routes(io));
        })
        
        

        // Start the server

        const port = process.env.PORT || 3030;

        httpServer.listen(port, () => {
            console.log(`Api is listening on http://localhost:${port}`);
        });


    }
}
