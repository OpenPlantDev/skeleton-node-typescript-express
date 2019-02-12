import {IElement} from "../models/element";
import {IQueryOptions} from "../services/queryOptions.service";

export interface IElementRepositoryGetActionResult {
    err: string | undefined;
    data: IElement | Array<IElement> | undefined;
}

export interface IElementRepositoryAddActionResult {
    err: string | undefined;
    data: string | undefined;
}

export interface IElementRepositoryDeleteActionResult {
    err: string | undefined;
}

export interface IElementRepository {
    GetElements : (query: IQueryOptions) => Promise<IElementRepositoryGetActionResult>;
    GetElementById : (id: string) => Promise<IElementRepositoryGetActionResult>;
    AddElement : (comp: IElement) => Promise<IElementRepositoryAddActionResult>;
    DeleteElement : (id: string) => Promise<IElementRepositoryDeleteActionResult>;
}

