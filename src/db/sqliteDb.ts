import {injectable} from "inversify";
import sqlite3 from "sqlite3";
import {SqliteService} from "../services/sqlite.service";
import {IElement} from "../models/element";
import {IElementRepositoryGetActionResult, 
        IElementRepositoryAddActionResult,
        IElementRepositoryDeleteActionResult,
        IElementRepository} from "../repositories/elementRepository";
import { IQueryOptions } from "../services/queryOptions.service";


const tableName = "elements";

const rowToComp = (row: any) : IElement => {
    return {
        id: row.id,
        elemType: row.elemType,        
        class: row.class,
        name: row.name,
        properties: row.properties ? JSON.parse(row.properties) : [],
    }
}

const rowsToElementArray = (rows: Array<any>) : Array<IElement> => {
    let elems = new Array<IElement>();

    if(!rows) {
        return elems;
    }

    rows.forEach((row) => {
        let elem = rowToComp(row);
        console.log(elem);
        elems.push(rowToComp(row));
    });

    return elems;
}

const getQueryString = (tableName: string, options?: IQueryOptions) : string => {
    let whereClause = "";
    let columns = "*";
    if(options) {
        whereClause = options.filter ? `Where ${options.filter}`  : whereClause;
        whereClause = options.limit ? `${whereClause} Limit ${options.limit}` : whereClause;
    }
    return `Select ${columns} from ${tableName} ${whereClause}`;
}

@injectable()
export class ElementSqliteDb implements IElementRepository {

    sqliteService: SqliteService;
    constructor() {
        let db = new sqlite3.Database('model.db');
        this.sqliteService = new SqliteService(db);
    }

    async GetElements(options: IQueryOptions) : Promise<IElementRepositoryGetActionResult> {
        const query = getQueryString(tableName, options);
        try {
            let rows = await this.sqliteService.dbAll(query, []);
            return({err: undefined, data: rowsToElementArray(rows)});
        }
        catch (err) {
            throw err;
        }
    }

    async GetElementById(id: string) : Promise<IElementRepositoryGetActionResult> {
        const query = `Select * from ${tableName} where id=${id}`;
        try {
            let rows = await this.sqliteService.dbAll(query, []);
            if(rows.length <= 0) {
                return({err: `Element with id [${id}] was not found`, data: undefined});
            } else {
                return({err: undefined, data: rowToComp(rows[0])});
            }
        }
        catch (err) {
            throw err;
        }
    }

    async AddElement(elem: IElement) : Promise<IElementRepositoryAddActionResult> {
        const elemType = elem.elemType ? elem.elemType : "";
        const elemClass = elem.class ? elem.class.trim() : "";
        const elemName = elem.name ? elem.name.trim() : "";
        const elemProps = elem.properties ? JSON.stringify(elem.properties) : "";
        if(elemType.length == 0) {
            return({ err: "elemType not defined", data: "" });
        } else if(elemClass.length == 0) {
            return({ err: "class not defined", data: "" });
        } else if(elemName.length == 0) {
            return({ err: "name not defined", data: "" });
        } else {
            const query = `Insert into ${tableName} (elemType, class, name, properties) Values
                            ('${elemType}', '${elemClass}', '${elemName}', '${elemProps}')`;
            try {
                let result = await this.sqliteService.dbRun(query, []);
                return({err: undefined, data: result.lastId});

            }
            catch (err) {
                throw err;
            }
        }
    }

    async DeleteElement(id: string) : Promise<IElementRepositoryDeleteActionResult> {
        const query = `Delete from ${tableName} where id=${id}`;
        try {
            let result = await this.sqliteService.dbRun(query, []);
            if(result.rowsAffected == 0) {
                return {err: `Element with id [${id}] was not found`};
            } else {
                return {err: undefined};
            }
        }
        catch (err) {
            throw err;
        }
    }

}

