import {IElement} from "./element";

export interface IComponentProperties {
    desc: string;
    manufacturer?: string;
    length?: number;
    weight? : number;
}

export interface IComponent extends IElement {
    properties: IComponentProperties;
}