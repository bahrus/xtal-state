import {XtalStateBase} from './xtal-state-base.js';
import {init, pushState, setState} from './xtal-state-api.js';
import {WithPath, with_path} from 'xtal-element/with-path.js';
import {UrlFormatter} from './url-formatter.js';
import {define} from 'trans-render/define.js';
import {debounce} from 'xtal-element/debounce.js';
import {XtalStateUpdateProps} from './types.d.js';

const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
const title = 'title';

const new$$ = 'new';
/**
 * Web component wrapper around the history api
 * @element xtal-state-update
 * 
 *
 */
export class XtalStateUpdate extends UrlFormatter(WithPath(XtalStateBase)) implements XtalStateUpdateProps {
    static get is() { return 'xtal-state-update'; }

    _make!: boolean;
    get make() {
        return this._make;
    }
    /**
     * PushState in history
     */
    set make(val: boolean) {
        this.attr(make, val, '');
    }
    _rewrite!: boolean;

    get rewrite() {
        return this._rewrite;
    }
    /**
     * Replace State into history
     */
    set rewrite(val: boolean) {
        this.attr(rewrite, val, '');
    }
    get history(){
        if(this._win === undefined) return undefined
        return this._win.history.state;
    }
    /**
     * Window Context History.State Object to push/replace
     */
    set history(newVal: any) {
        
        this._queuedHistory.push(newVal);
        this.onPropsChange();
    }

    _title = '';
    get title() {
        return this._title;
    }
    /**
     * Title to use when calling push/replace state
     */
    set title(val) {
        this.attr(title, val);
    }


    _new: boolean;
    get new(){
        return this._new;
    }
    /**
     * Initite history to empty object
     */
    set new(v){
        this.attr(new$$, v, '');
    }

    static get observedAttributes() {
        return super.observedAttributes.concat(super.UFAttribs).concat([make, rewrite, title, with_path, new$$]);
    }

    attributeChangedCallback(n: string, ov: string, nv: string) {
        
        switch (n) {
            case new$$:
            case rewrite:
            case make:
                this['_' + n] = nv !== null;
                break;
            case title:
                this['_' + n] = nv;
                break;
            case with_path:
                this._withPath = nv;
                break;

        }
        super.attributeChangedCallback(n, ov, nv);
    }
    _debouncer;
    connectedCallback() {
        this.propUp([make, rewrite, title, 'withPath', 'stringifyFn', new$$, 'syncHistory'].concat([history$]));
        this._debouncer = debounce(() => {
            this.updateHistory();
        }, 50);
        super.connectedCallback();
    }
    _win: Window | undefined;
    _init: boolean;
    _queuedHistory: object[] = [];
    onPropsChange() {
        if(!super.onPropsChange()) return false;
        if (!this._make && !this._rewrite) return false;
        if(!this._init){
            this._init = true;
            if (this._storeKeeper) {
                this._storeKeeper.getContextWindow().then(win => {
                  this._win = win;
                  //init(win);
                  this.onPropsChange();
                });
                return;
            } else {
                this._win = window;
            }
        }

        this._debouncer();
    }



    
    updateHistory() {
        let url = this._url;
        if(url){
            url = this.adjustUrl(url);
        }

        if(this._rewrite){
            const hist = this._new ? {} : this._queuedHistory.shift();
            if(hist === null || hist === undefined) return;
            setState(this.wrap(hist), this._title, url, this._win);
        }else{

            const hist = this._new ? {} : this._queuedHistory.shift();
            if(hist === null || hist === undefined) return;
            this._disabled = true;
            pushState(this.wrap(hist), this._title, url, this._win);
            this._disabled = false;
        }
        this.de('history',{
            value: this._win.history.state
        });
        if(this._queuedHistory.length > 0){
            this._debouncer();
        }

    }

}
define(XtalStateUpdate);