import {IHistoryInfo, IHistoryUpdateDetails} from './types.d.js';
const xtalStateInfoSym = Symbol('xsis');
export const history_state_update = 'history-state-update';
import {mergeDeep} from 'trans-render/mergeDeep.js';

export function init(win: Window = window): void{
    if(win[xtalStateInfoSym]) return;
    win[xtalStateInfoSym] = true;
    if(!win[xtalStateInfoSym]){
        win[xtalStateInfoSym] = {
            startedAsNull: win.history.state === null,
        } as IHistoryInfo;
    }
    const originalPushState = win.history.pushState;
    const boundPushState = originalPushState.bind(win.history);
    win.history.pushState = function (newState: any, title: string, URL: string) {
        const oldState = win.history.state;
        boundPushState(newState, title, URL);
        de(oldState, win, title);
    }

    const originalReplaceState = win.history.replaceState;
    const boundReplaceState = originalReplaceState.bind(win.history); 
    win.history.replaceState = function (newState: any, title: string, URL: string) {
        const oldState = win.history.state; 
        boundReplaceState(newState, title, URL);
        de(oldState, win, title);
    }

}
init();

function de(oldState: any, win: Window, title: string){
    const detail = {
        oldState: oldState,
        newState: win.history.state,
        initVal: false
    } as IHistoryUpdateDetails;
    const historyInfo = win[xtalStateInfoSym] as IHistoryInfo;
    if(!historyInfo.hasStarted){
        historyInfo.hasStarted = true;
        if(historyInfo.startedAsNull){
            detail.initVal = true;
        }
    }
    const newEvent = new CustomEvent(history_state_update, {
        detail: detail,
        bubbles: true,
        composed: true,
    } as CustomEventInit);
    win.dispatchEvent(newEvent);
}

export function setState(state: object, win: Window = window){
    window.requestAnimationFrame(function () {
        const merged = mergeDeep(win.history.state, state);
        win.history.replaceState(merged, '', win.location.href);
    });

}

