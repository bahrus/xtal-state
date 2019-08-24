import {IHistoryInfo, IHistoryUpdateDetails} from './types.js';
const xtalStateInfoSym = Symbol('xsis');
export const history_state_update = 'history-state-update';
import {mergeDeep} from 'trans-render/mergeDeep.js';

export function init(win: Window = window): IHistoryInfo{
    if(win[xtalStateInfoSym]) return;
    win[xtalStateInfoSym] = {
        startedAsNull: win.history.state === null,
    } as IHistoryInfo;
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
        initVal: false,
        title: title
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

export function setState(state: object, title: string = '', url: string | null = null, win: Window = window){
    doState(state, 'replace', title, url, win);
}

export function pushState(state: object, title: string = '', url: string, win: Window = window){
    doState(state, 'push', title, url, win);
}

function doState(state: object, verb: string, title: string  = '', url: string | null = null, win: Window = window){
    window.requestAnimationFrame(() => {
        let oldState = win.history.state;
        if(oldState === null) oldState = {};
        const merged = (typeof(oldState === 'object') && (typeof(state) === 'object')) ? mergeDeep(oldState, state) : state;
        window.requestAnimationFrame(() =>{
            win.history[verb + 'State'](merged, title, url === null ? win.location.href : url);
        })
    });
}

