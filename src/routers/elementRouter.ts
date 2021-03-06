import {inject, injectable} from "inversify";
import DITypes from "../dependencyInjection/DITypes";
import {Router} from "express";
import {IElementController} from "../controllers/ElementController";
import * as socketio from "socket.io";

export interface IElementRouter {
    route: string;
    Routes: (ioServer: socketio.Server) => Router;
}

// The job of the Router is to pass the given request to the proper method on the given controller
// The routes in ElementRouter are relative to "/api/elements" due to the way the router is used in api.ts:
//      api.use("/api/elements", this.elementRouter.Routes());
// so in the ElementRouter a route defined for "/:id" has a full route of "/api/element/:id"
// Note that the ElementController calls return Promise<Response> because they are async due to reading/writing to db

@injectable()
export class ElementRouter implements IElementRouter {

    route: string =  "/api/models/elements";
    router: Router;
    elementController: IElementController;

    constructor(@inject(DITypes.ElemController)elemController: IElementController) {
        this.router = Router();
        this.elementController = elemController;
    }

    Routes(ioServer: socketio.Server) : Router {
        // for a get request with route "/api/elements" call the GetElements method on the controller
        this.router.get("/", async (req, res) => {
            try {
                const result = await this.elementController.GetElements(req, res);
                return result;
            }
            catch(err) {
                res.status(500);
                return (res.send(err instanceof Error ? err.message: err));
            }
        });

        // for a get request with route "/api/elements/:id" call the GetElementById method on the controller
        this.router.get("/:id", async (req, res) => {
            try {
                const result = this.elementController.GetElementById(req, res);
                return result;
            }
            catch(err) {
                res.status(500);
                return (res.send(err instanceof Error ? err.message: err));
            }
        });

        // for a post request with route"/api/elements" call the AddElement method on the controller
        this.router.post("/", async (req, res) => {
            try {
                const result = this.elementController.AddElement(req, res);
                ioServer.emit("dbUpdated", `component added: ` );
                return result;
            }
            catch(err) {
                res.status(500);
                return (res.send(err instanceof Error ? err.message: err));
            }
        });

        // for a delete request with route"/api/elements/:id" call the DeleteElement method on the controller
        this.router.delete("/:id", async (req, res) => {
            try {
                const result = this.elementController.DeleteElement(req, res);
                ioServer.emit("dbUpdated", `component deleted: ` );
                return result;
            }
            catch(err) {
                res.status(500);
                return (res.send(err instanceof Error ? err.message: err));
            }
        });

        return this.router;
    }
}