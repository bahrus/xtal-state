export interface IHistoryInfo{
    startedAsNull?: boolean;
    hasStarted?:boolean;
}
export interface IHistoryUpdateDetails {
    oldState: any,
    newState: any,
    initVal: boolean,
}