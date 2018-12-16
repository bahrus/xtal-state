import { XtallatX } from 'xtal-latx/xtal-latx.js';
import {getHost} from 'xtal-latx/getHost.js';
const level = 'level';
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
export function getWinCtx(el: HTMLElement, level: string){
    const _t = this;
    return new Promise((resolve, reject) => {
        switch(level){
            case "global":
                resolve(self);
                break;
            case "local":
                getIFrmWin(el.parentElement, ifrm => resolve(ifrm.contentWindow));
                break;
            case "shadow":
                getIFrmWin(getHost(el), ifrm => resolve(ifrm.contentWindow));
                break;
            default:
                getIFrmWin(getMchPar(el, level), ifrm => resolve(ifrm.contentWindow));
        }
    });
}
export class XtalStateBase extends XtallatX(HTMLElement){
    private _level = 'global';
    get level(){
        return this._level;
    }
    set level(val){
        this.attr(level, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([level]);
    }
    _window: Window
    get window(){
        return this._window;
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch(name){
            case level:
                this._level = newVal;
                break;
        }
        this.onPropsChange();
    }
    _conn!:boolean;
    connectedCallback(){
        this.style.display = 'none';
        this._upgradeProperties(['disabled', level]);
        this._conn = true;
        this.onPropsChange();

    }
    _notReady!: boolean;

    // getMchPar(){
    //     let test = this.parentElement;
    //     while(test){
    //         if(test.matches(this.level)) return test;
    //         test = test.parentElement;
    //     }
    // }
    onPropsChange(){
        if(!this._conn || this._disabled) return true;
        if(!this._window){
            this._notReady = true;
            getWinCtx(this, this._level).then((win: Window) =>{
                this._window = win;
                this._notReady = false;
            })
        }
        if(this._notReady) return true;
    }
}