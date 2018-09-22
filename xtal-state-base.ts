import { XtallatX } from 'xtal-latx/xtal-latx.js';
import {getHost} from 'xtal-latx/getHost.js';
const level = 'level';
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
        this._upgradeProperties(['disabled', level])
        this._conn = true;
        this.onPropsChange();

    }
    getWinObj(par: HTMLElement | DocumentFragment) : Window{
        let ifr = par.querySelector('iframe[xtal-state]') as HTMLIFrameElement;
        if(ifr === null){
            ifr = document.createElement('iframe');
            //ifr.src = 'about:blank';
            ifr.setAttribute('xtal-state', '');
            ifr.src = 'blank.html';
            ifr.style.display = 'none';
            par.appendChild(ifr);
        }
        return ifr.contentWindow;
    }
    onPropsChange(){
        if(!this._conn || this._disabled) return true;
        if(!this._window){
            switch(this._level){
                case "global":
                    this._window = self;
                    break;
                case "local":
                    this._window = this.getWinObj(this.parentElement);
                    break;
                case "shadow":
                    this._window = this.getWinObj(getHost(this));
                    break;
            }
        }
    }
}