import {getHost} from 'xtal-latx/getHost.js';
export const history_state_update = 'history-state-update';
export interface IHistoryUpdateDetails {
    oldState: any,
    newState: any,
    initVal: boolean,
}
export interface IHistoryInfo{
    startedAsNull?: boolean;
    hasStarted?:boolean;
}
/**
 * 
 * @param par Parent or document fragment which should mantain regional state
 * @param _t XtalStateBase element
 */
function  getIFrmWin(par: HTMLElement | DocumentFragment, callBack?: (ifrm: HTMLIFrameElement) => void) : Window{
    let ifr = par.querySelector('iframe[xtal-state]') as HTMLIFrameElement;
    if(ifr === null){
        ifr = document.createElement('iframe');
        //ifr.src = 'about:blank';
        ifr.setAttribute('xtal-state', '');
        ifr.addEventListener('load', () =>{
            ifr.setAttribute('loaded', '');
            if(callBack !== null) callBack(ifr);
        })
        ifr.src = 'blank.html';
        ifr.style.display = 'none';
        par.appendChild(ifr);
    }else{
        if(!ifr.hasAttribute('loaded')){
            ifr.addEventListener('load', () =>{
                if(callBack !== null) callBack(ifr);
            })
        }else{
            if(callBack !== null) callBack(ifr);
        }
    }
    return ifr.contentWindow;
}

function getMchPar(el: HTMLElement, level: string){
    let test = el.parentElement;
    while(test){
        if(test.matches(level)) return test;
        test = test.parentElement;
    }
}
function getSC(el: HTMLElement){
    const test = getHost(el);
    return test.shadowRoot === null ? test : test.shadowRoot;
}
export function getWinCtx(el: HTMLElement, level: string){
    const _t = this;
    return new Promise((resolve, reject) => {
        switch(level){
            case "global":
                init(self);
                resolve(self);
                break;
            case "local":
                getIFrmWin(el.parentElement, ifrm => {
                    init(ifrm.contentWindow);
                    resolve(ifrm.contentWindow);
                });
                break;
            case "shadow":
                getIFrmWin(getSC(el), ifrm => {
                    init(ifrm.contentWindow);
                    resolve(ifrm.contentWindow)
                });
                break;
            default:
                getIFrmWin(getMchPar(el, level), ifrm => {
                    init(ifrm.contentWindow);
                    resolve(ifrm.contentWindow)
                } );
        }
    });
}

function de(oldState: any, win: any){
    const detail = {
        oldState: oldState,
        newState: win.history.state,
        initVal: false
    } as IHistoryUpdateDetails;
    const historyInfo = win.__xtalStateInfo as IHistoryInfo;
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

function init(win: any): void{
    if(win.__xtalStateInit) return;
    win.__xtalStateInit = true;
    if(!win.__xtalStateInfo){
        win.__xtalStateInfo = {
            startedAsNull: win.history.state === null,
        } as IHistoryInfo;
    }
    const originalPushState = win.history.pushState;
    const boundPushState = originalPushState.bind(win.history);
    win.history.pushState = function (newState: any, title: string, URL: string) {
        const oldState = win.history.state;
        boundPushState(newState, title, URL);
        de(oldState, win);
    }

    const originalReplaceState = win.history.replaceState;
    const boundReplaceState = originalReplaceState.bind(win.history); 
    win.history.replaceState = function (newState: any, title: string, URL: string) {
        const oldState = win.history.state; 
        boundReplaceState(newState, title, URL);
        de(oldState, win);
    }

}