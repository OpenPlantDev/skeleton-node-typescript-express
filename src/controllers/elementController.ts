import {inject, injectable} from "inversify";
import DITypes from "../dependencyInjection/DITypes";
import {Request, Response} from "express";
import { IElementRepository } from '../repositories/elementRepository';
import { QueryOptions } from "../services/queryOptions.service";


export interface IElementController {
    GetElements : (req: Request, res: Response) => Promise<Response>;
    GetElementById : (req: Request, res: Response) => Promise<Response>;
    AddElement : (req: Request, res: Response) => Promise<Response>;
    DeleteElement : (req: Request, res: Response) => Promise<Response>;

}
// The job of the Controller is to parse the request and then to call the proper method on the given repository
// Note that The ElementRepository calls return Promise<IElementRepositoryActionResult> because they are async due to reading/writing to db
// The IElementRepositoryActionResult is an object with an err property and a data property

@injectable()
export class ElementController implements IElementController {

    elementRepository: IElementRepository;

    constructor(@inject(DITypes.ElemRepository)elemRepo: IElementRepository) {
        this.elementRepository = elemRepo;
    }

    async GetElements(req: Request, res: Response) : Promise<Response> {
        try {
            console.log(req.params);
            const result = await this.elementRepository.GetElements(QueryOptions.get(req.query));
            if(result.err) {
                res.status(400);
                return (res.send(result.err));
            } else {
                return(res.json(result.data));
            }
        }
        catch(err) {
            res.status(500);
            return (res.send(err));
        }

    }

    async GetElementById(req: Request, res: Response) : Promise<Response> {
        try {
            let result = await this.elementRepository.GetElementById(req.params.id);
            if(result.err) {
                console.log(result.err);
                res.status(404);
                return(res.send(result.err));
            } else {
                return(res.json(result.data));
            }
        }
        catch(err) {
            res.status(500);
            return(res.send(err));
        }
    }

    async AddElement(req: Request, res: Response) : Promise<Response> {
        let elem = {
            id: "",
            elemType: req.body.elemType,
            class: req.body.class,
            name: req.body.name,
            properties: req.body.properties ? req.body.properties : ""
        };
        //console.log(elem);
        try {
            const result = await this.elementRepository.AddElement(elem);
            if(result.err) {
                res.status(500);
                return(res.send(result.err));
            } else {
                res.status(201);
                res.location(`${req.baseUrl}/${result.data}`)
                return(res.json(result.data));
            }
        }
        catch(err) {
            res.status(500);
            return(res.send(err));
        }
    }

    async DeleteElement(req: Request, res: Response) : Promise<Response> {
        try {
            const result = await this.elementRepository.DeleteElement(req.params.id);
            if(result.err) {
                res.status(404);
                return(res.send(result.err));
            } else {
                return(res.sendStatus(200));
            }
        }
        catch(err) {
            res.status(500);
            return(res.send(err));
        }
    }
} 
