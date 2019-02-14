import {IElement} from "./element";

export interface IWbsItemProperties {
    desc: string;
}

export interface IWbsItem extends IElement {
    properties: IWbsItemProperties;
}