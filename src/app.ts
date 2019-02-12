import {Api, IApiRouter} from "./api";

import {ElementMockDb} from "./db/mockDb";
import {ElementSqliteDb} from "./db/sqliteDb";
import {ElementController} from "./controllers/elementController";
import {ElementRouter} from "./routers/elementRouter";

const useMock = false;

const elemRepo = useMock ? new ElementMockDb() : new ElementSqliteDb();


// should use dependency injection here
//const elemRepo = ;
const elemController = new ElementController(elemRepo);
const elemRouter = new ElementRouter(elemController);

const routers: Array<IApiRouter> = [
    elemRouter
];

let api = new Api();

api.Start(routers);



