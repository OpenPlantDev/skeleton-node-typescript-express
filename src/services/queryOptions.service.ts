export interface IQueryOptions {
    elemType? : string | undefined;
    filter? : string | undefined;
    limit? : number | undefined;
    orderby? : string | undefined;
}

export  class QueryOptions {

    public static get = (queryParams: any) : IQueryOptions => {
        let limit = undefined;
        if(queryParams.limit) {
            let limitNum = Number(queryParams.limit);
            if(!isNaN(limitNum)) {
                limit = limitNum;
            }
        }
        return {
            elemType: queryParams.elemType ? queryParams.elemType : undefined,
            filter: queryParams.filter ? queryParams.filter : undefined,
            limit: limit,
            orderby: queryParams.orderby ? queryParams.orderby : undefined
        }
    }
}


