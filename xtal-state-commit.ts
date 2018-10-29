import {XtalStateBase} from './xtal-state-base.js';
import {WithPath, with_path} from 'xtal-latx/with-path.js';

import {define} from 'xtal-latx/define.js';
import {debounce} from 'xtal-latx/debounce.js';
import { XtalStateParse } from './xtal-state-parse.js';

const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';
const url = 'url';
const url_search = 'url-search';
const replace_url_value = 'replace-url-value';
const init = 'init';
/**
 * `xtal-state-commit`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalStateCommit extends WithPath(XtalStateBase) {
    static get is() { return 'xtal-state-commit'; }

    _make!: boolean;
    /**
     * PushState in history
     */
    get make() {
        return this._make;
    }
    set make(val: boolean) {
        this.attr(make, val, '');
    }
    _rewrite!: boolean;
    /**
     * ReplaceState in history
     */
    get rewrite() {
        return this._rewrite;
    }
    set rewrite(val: boolean) {
        this.attr(rewrite, val, '');
    }
    _history: any;
    /**
     * Window Context History Object
     */
    get history(){
        return this._window.history.state;
    }
    set history(newVal: any) {
        this._history = newVal;
        this.onPropsChange();
    }

    _title = '';
    /**
     * Title to use when calling push/replace state
     */
    get title() {
        return this._title;
    }
    set title(val) {
        this.attr(title, val);
    }
    _url!: string;
    /**
     * URL to use when calling push/replace state
     */
    get url() {
        return this._url;
    }
    set url(val) {
        this.attr(url, val);
    }

    _urlSearch!: string;
    /**
     * Regular expression to search url for.
     */
    get urlSearch(){
        return this._urlSearch;
    }
    set urlSearch(val){
        this.attr(url_search, val);
    }

    _stringifyFn!: (t: XtalStateCommit) => string;
    get stringifyFn(){
        return this._stringifyFn;
    }
    set stringifyFn(nv){
        this._stringifyFn = nv;
    }

    set syncHistory(nv){
        this.value = nv;
        this.de('history',{
            value: nv
        });
    }
    _replaceUrlValue!: string;
    /**
     * Replace URL expression, coupled with urlSearch
     */
    get replaceUrlValue(){
        return this._replaceUrlValue;
    }
    set replaceUrlValue(val: string){
        this.attr(replace_url_value, val);
    }

    _init: boolean;
    get init(){
        return this._init;
    }
    set init(v){
        this.attr(init, v, '');
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([make, rewrite, title, url, with_path, url_search, replace_url_value, init]);
    }

    attributeChangedCallback(n: string, ov: string, nv: string) {
        
        switch (n) {
            case rewrite:
            case make:
                this['_' + n] = nv !== null;
                break;
            case url:
            case title:
                this['_' + n] = nv;
                break;
            case with_path:
                this._withPath = nv;
                break;
            case url_search:
                this._urlSearch = nv;
                break;
            case replace_url_value:
                this._replaceUrlValue = nv;
                break;
             

        }
        super.attributeChangedCallback(n, ov, nv);
        //this.onPropsChange();
    }
    _debouncer;
    //_connected!: boolean;
    connectedCallback() {
        this._upgradeProperties([make, rewrite, title, url, 'withPath', 'urlSearch', 'replaceUrlValue', 'stringifyFn', init].concat([history$]));
        this._debouncer = debounce(() => {
            this.updateHistory();
        }, 50);
        //this._connected = true;
        super.connectedCallback();
    }
    onPropsChange() {
        if(this._disabled) return;
        if(super.onPropsChange()) {
            if(this._notReady){
                setTimeout(() => {
                    this.onPropsChange();
                }, 50);
                return;
            }
            return true;
        }
        if (!this._make && !this._rewrite) return true;
        this._debouncer();
    }
    mergedHistory(){
        if(this._history === undefined) return undefined;
        return this.wrap(this._history);
    }
    value: any;
    updateHistory() {
        const hist = this._init ? {} : this.mergedHistory();
        if(hist === null || hist === undefined) return;
       
        const method = this.make ? 'push' : 'replace';
        
        //const bH = this._window.history;
        //if(compare(bH.state, hist)) return;
        this.value = hist;
        this._disabled = true;
        this.de('history',{
            value: hist
        });
        this._disabled = false;
        if(this.make && !this.url) return;
        let url = this._url;
        if(!url || this._init){
            if(!this._replaceUrlValue || this._init){
                url = this._window.location.href;
            }
        }
        if(!url) return; 
        if(this._stringifyFn){
            url = this._stringifyFn(this);
        }else if(this._replaceUrlValue && this._urlSearch){
            const reg = new RegExp(this._urlSearch);
            url = url.replace(reg, this._replaceUrlValue);
        }
        this._window.history[method + 'State'](hist, this._title, url);
    }
}
define(XtalStateCommit);