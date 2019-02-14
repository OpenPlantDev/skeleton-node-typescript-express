import sqlite3 from "sqlite3";
import {IQueryOptions} from "./queryOptions.service";

export interface IRunResults {
    rowsAffected: number;
    lastId: string;
}


export class SqliteService {

    db: sqlite3.Database;
    constructor(db: sqlite3.Database) {
        this.db = db;
    }
    getQueryString = (tableName: string, options?: IQueryOptions) : string => {
        let whereClause = "";
        let columns = "*";
        if(options) {
            whereClause = options.filter ? `Where ${options.filter}`  : whereClause;
            whereClause = options.orderby ? `${whereClause}  order by ${options.orderby}` : whereClause;
            whereClause = options.limit ? `${whereClause} Limit ${options.limit}` : whereClause;
        }
        return `Select ${columns} from ${tableName} ${whereClause}`;
    }
       
    // dbAll calls sqlite.db.all (which takes a callback) and returns a Promise
    // this allows callers to dbAll to use async/await
    dbAll = (query: string, params: any) : Promise<Array<any>> => {
        console.log(`query = ${query}`);
        return new Promise<Array<any>>((resolve, reject) => {
            this.db.all(query, [], (err, rows) => {
                if(err) {
                    console.log(`error running query = ${query}`);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // dbRun calls sqlite.db.run (which takes a callback) and returns a Promise
    // this allows callers to dbRun to use async/await
    dbRun = (query: string, params: any) : Promise<IRunResults> => {
        console.log(query);
        return new Promise<IRunResults>((resolve, reject) => {
            // note the callback to .run cannot be an arrow function if you want to access
            // this.lastID as it is set by the calling method
            this.db.run(query, [], function (err)  {
                if(err) {
                    console.log(`error running query = ${query}`);
                    console.log(err);
                    reject(err);
                } else {
                    resolve({rowsAffected: this.changes, lastId: this.lastID.toString()});
                }

            });
        });
    }
    

}