import express from "express";
import {Router} from "express";

export interface IApiRouter {
    route: string;
    Routes: () => Router;
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

        // routers
        routers.map((router) => {
            api.use(router.route, router.Routes());
        })

        // Start the server

        const port = process.env.PORT || 3030;

        api.listen(port, () => {
            console.log(`Api is listening on http://localhost:${port}`);
        });


    }
}
