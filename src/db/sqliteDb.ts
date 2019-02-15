import {injectable} from "inversify";
import * as fs from 'fs';
import sqlite3 from "sqlite3";
import {SqliteService} from "../services/sqlite.service";
import {IElementRepositoryGetActionResult, 
        IElementRepositoryAddActionResult,
        IElementRepositoryDeleteActionResult,
        IElementRepository} from "../repositories/elementRepository";
import { IQueryOptions } from "../services/queryOptions.service";
import { IModelElement } from "../models/model";


const tableName = "elements";

const rowToComp = (row: any) : IModelElement => {
    return {
        id: row.id,
        elemType: row.elemType,        
        class: row.class,
        name: row.name,
        properties: row.properties ? JSON.parse(row.properties) : [],
    }
}

const rowsToElementArray = (rows: Array<any>) : Array<IModelElement> => {
    let elems = new Array<IModelElement>();

    if(!rows) {
        return elems;
    }

    rows.forEach((row) => {
        //let elem = rowToComp(row);
        //console.log(elem);
        elems.push(rowToComp(row));
    });

    return elems;
}

@injectable()
export class ElementSqliteDb implements IElementRepository {

    sqliteService: SqliteService | undefined = undefined;
    connectionError: Error = new Error("");

    constructor() {
        let connectionString = process.env.connectionString;
        if(!connectionString) {
            this.connectionError = new Error(`ConnectionString is not set in environment`);
            console.log(this.connectionError.message);
            return;
        }
        if(!fs.existsSync(connectionString)) {
            this.connectionError = new Error(`Database not found: ${connectionString}`);
            console.log(this.connectionError.message);
            return;
        }
        let db = new sqlite3.Database(connectionString, (err) => {
            if(err) {
                this.connectionError = err;
                console.log(this.connectionError.message);
            }
            else {
                this.sqliteService = new SqliteService(db);
            }
        });
    }

    IsConnected = () => {
        return this.sqliteService !== undefined;
    }

    async GetElements(options: IQueryOptions) : Promise<IElementRepositoryGetActionResult> {
        if(this.sqliteService === undefined) {
            console.log(this.connectionError.message);
            throw this.connectionError;
        }
        const query = this.sqliteService.getQueryString(tableName, options);
        try {
            let rows = await this.sqliteService.dbAll(query, []);
            return({err: undefined, data: rowsToElementArray(rows)});
        }
        catch (err) {
            throw err;
        }
    }

    async GetElementById(id: string) : Promise<IElementRepositoryGetActionResult> {
        if(this.sqliteService === undefined) {
            console.log(this.connectionError.message);
            throw this.connectionError;
        }
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

    async AddElement(elem: IModelElement) : Promise<IElementRepositoryAddActionResult> {
        if(this.sqliteService === undefined) {
            console.log(this.connectionError.message);
            throw this.connectionError;
        }
        //console.log(elem);
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
        if(this.sqliteService === undefined) {
            console.log(this.connectionError.message);
            throw this.connectionError;
        }
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

