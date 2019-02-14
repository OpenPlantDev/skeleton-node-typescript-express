import {IModelElement, IModel} from "../models/model";

const elements: Array<IModelElement> = [
    {
        id: "1",
        elemType: "component",
        class: "valve",
        name: "FV-100",
        properties: { desc: 'Gate Valve', length: 50, weight: 100 }
      },
    
      {
        id: "2",
        elemType: "component",
        class: "pump",
        name: "FP-100",
        properties: {desc:"Centrifugal Pump", manufacturer: "ABC"}
      },
    
      {
        id: "3",
        elemType: "component",
        class: "tank",
        name: "FT-100",
        properties: {desc:"Horizontal Tank", manufacturer: "XYZ"}
      },
      { id: "4", elemType: "wbsitem", class: "unit", name: "U1", properties: {desc: "Unit #1"}},
      { id: "5", elemType: "wbsitem", class: "unit", name: "U2", properties: {desc: "Unit #2"}},
      { id: "6", elemType: "wbsitem", class: "service", name: "S1", properties: {desc: "Service #1"}},
      { id: "7", elemType: "wbsitem", class: "area", name: "A1", properties: {desc: "Area #1"}},
    ];

    const model: IModel = {
      elements: elements
    }

    export default model;