import {Api, IApiRouter} from "./api";

import {ElementMockDb} from "./db/mockDb";
import {ElementController} from "./controllers/elementController";
import {ElementRouter} from "./routers/elementRouter";


// should use dependency injection here
const elemRepo = new ElementMockDb();
const elemController = new ElementController(elemRepo);
const elemRouter = new ElementRouter(elemController);

const routers: Array<IApiRouter> = [
    elemRouter
];

let api = new Api();

api.Start(routers);



