import container from "./dependencyInjection/DIContainer";
import DITypes from "./dependencyInjection/DITypes";
import {Api, IApiRouter} from "./api";

import {IElementRouter} from "./routers/elementRouter";

const elemRouter: IElementRouter = container.get<IElementRouter>(DITypes.ElemRouter);

const routers: Array<IApiRouter> = [
    elemRouter
];

let api = new Api();

api.Start(routers);



