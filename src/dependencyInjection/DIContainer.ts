import "reflect-metadata";
import { Container } from "inversify";

import DITypes from "./DITypes";

import {IElementRepository} from "../repositories/elementRepository";
import {IElementController, ElementController} from "../controllers/elementController";
import {IElementRouter, ElementRouter} from "../routers/elementRouter";

import {ElementSqliteDb} from "../db/sqliteDb";
import {ElementMockDb} from "../db/mockDb";

const mockDb = true;

let container = new Container();

container.bind<IElementController>(DITypes.ElemController).to(ElementController);
container.bind<IElementRouter>(DITypes.ElemRouter).to(ElementRouter);
if(mockDb) {
    container.bind<IElementRepository>(DITypes.ElemRepository).to(ElementMockDb);
} else {
    container.bind<IElementRepository>(DITypes.ElemRepository).to(ElementSqliteDb);
}

export default container;