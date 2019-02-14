import {IComponent} from "./component";
import { IWbsItem } from "./wbsItem";

export type IModelElement = IComponent | IWbsItem;

export interface IModel {
    elements: Array<IModelElement>;
}