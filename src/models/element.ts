import {IProperty} from "./property";

export interface IElement {
    id: string;
    elemType: string;
    class: string;
    name: string;
    properties: Array<IProperty>;
}
