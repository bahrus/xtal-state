import { XtallatX } from 'xtal-latx/xtal-latx.js';
const with_url_pattern = 'with-url-pattern';

export class XtalStateParse extends XtallatX(HTMLElement){
    static get is(){return 'xtal-state-parse';}
    static get observedAttributes(){return super.observedAttributes.concat([with_url_pattern])}

    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        super.attributeChangedCallback(name, oldVal, newVal);
        switch(name){
            case with_url_pattern:
                this._withURLPattern = newVal;
                break;
        }
        this.onPropsChange();
    }
    _withURLPattern: string;
    get withURLPattern(){
        return this._withURLPattern;
    }
    set withURLPattern(val){
        this.attr(with_url_pattern, val);
    }

    _isConnected: boolean;
    connectedCallback(){
        this._upgradeProperties(['disabled', 'withURLPattern']);
        this._isConnected = true;
        this.onPropsChange();
    }

    onPropsChange(){
        if(!this._isConnected || this._disabled || !this._withURLPattern || history.state) return;
        const reg = new RegExp(this._withURLPattern);
        const parsed = reg.exec(location.href);
        if(!parsed) return;
        history.replaceState(parsed['groups'], 'Init', location.pathname);
    }
}

customElements.define(XtalStateParse.is, XtalStateParse);