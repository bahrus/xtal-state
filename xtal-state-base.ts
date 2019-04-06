import { XtallatX } from 'xtal-element/xtal-latx.js';
import {up, hydrate, disabled} from 'trans-render/hydrate.js';
import {getWinCtx} from './xtal-state-api.js';
const level = 'level';




export class XtalStateBase extends XtallatX(hydrate(HTMLElement)){
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
        this[up](['disabled', level]);
        this._conn = true;
        this.onPropsChange();

    }
    _notReady!: boolean;

    
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