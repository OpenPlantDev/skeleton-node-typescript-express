import {IModelElement} from "../models/model";
import {IQueryOptions} from "../services/queryOptions.service";

export interface IElementRepositoryGetActionResult {
    err: string | undefined;
    data: IModelElement | Array<IModelElement> | undefined;
}

export interface IElementRepositoryAddActionResult {
    err: string | undefined;
    data: string | undefined;
}

export interface IElementRepositoryDeleteActionResult {
    err: string | undefined;
}

export interface IElementRepository {
    IsConnected: () => boolean;
    GetElements : (query: IQueryOptions) => Promise<IElementRepositoryGetActionResult>;
    GetElementById : (id: string) => Promise<IElementRepositoryGetActionResult>;
    AddElement : (comp: IModelElement) => Promise<IElementRepositoryAddActionResult>;
    DeleteElement : (id: string) => Promise<IElementRepositoryDeleteActionResult>;
}

