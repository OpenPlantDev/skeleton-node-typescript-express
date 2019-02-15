import { IPropertyObject } from "./propertyObject";

export interface IElement {
    id: string;
    elemType: string;
    class: string;
    name: string;
    properties: IPropertyObject;
}
