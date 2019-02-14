import {injectable} from "inversify";
import {Guid} from "guid-typescript";
import {IModelElement} from "../models/model";
import {IElementRepositoryGetActionResult, 
        IElementRepositoryAddActionResult,
        IElementRepositoryDeleteActionResult,
        IElementRepository} from "../repositories/elementRepository";

import model from "../data/modelData";

@injectable()
export class ElementMockDb implements IElementRepository {

    elements: Array<IModelElement>;
    constructor() {
        this.elements = model.elements;
    }

    GetElements() : Promise<IElementRepositoryGetActionResult> {
        return new Promise<IElementRepositoryGetActionResult>((resolve) => {
            resolve({err: undefined, data: this.elements});

        });
    }

    GetElementById(id: string) : Promise<IElementRepositoryGetActionResult> {
        return new Promise<IElementRepositoryGetActionResult>((resolve, reject) => {
            let elem = this.elements.find((elem) => elem.id === id);
            if (elem) {
                resolve({err: undefined, data: elem});
            } else {
                resolve({err: `Element with id [${id}] was not found`, data: undefined});
            }

        });
    }

    AddElement(elem: IModelElement) : Promise<IElementRepositoryAddActionResult> {

        return new Promise<IElementRepositoryAddActionResult> ((resolve, reject) => {
            elem.elemType = elem.elemType ? elem.elemType : "";
            elem.class = elem.class ? elem.class.trim() : "";
            elem.name = elem.name ? elem.name.trim() : "";

            if(elem.elemType.length == 0) {
                resolve({ err: "elemType not defined", data: "" });
            } else if(elem.class.length == 0) {
                resolve({ err: "class not defined", data: ""});
            } else if(elem.name.length == 0) {
                resolve({ err: "name not defined", data: ""});
            } else {
                elem.id = Guid.create().toString();
                this.elements.push(elem);
                resolve({err: undefined, data: elem.id});
            }

        });
    }

    DeleteElement(id: string) : Promise<IElementRepositoryDeleteActionResult> {
        return new Promise<IElementRepositoryDeleteActionResult>((resolve, reject) => {
            const index = this.elements.findIndex((elem) => elem.id === id);
            if (index < 0) {
                resolve({err: `Element with id [${id}] was not found`});
            } else {
                this.elements.splice(index, 1);
                resolve({err: undefined});
            }

        });
    }

}