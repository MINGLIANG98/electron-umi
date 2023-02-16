export type ResponseTableType<T> = {
    data:T[],
    success:boolean,
    code:number,
    total:number
}
// 用于流程头的定义类型
export type UserHead = {
    personId?:string|number;
    groupId?:string|number;

}

export type WResponseType<T> = {
    result:{records:T[],total:number},
    success:boolean,
    code:number,
    total:number,
    message:string
}