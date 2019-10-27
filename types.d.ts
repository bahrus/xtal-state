export interface IHistoryInfo{
    startedAsNull?: boolean;
    hasStarted?:boolean;
}
export interface IHistoryUpdateDetails {
    oldState: any,
    newState: any,
    initVal: boolean,
}
export interface XtalStateUpdateProps {
    guid: string,
    make: boolean,
    rewrite: boolean,
    history: any,
    title: string,
    new: boolean,
    withPath: string
}