import {XtalStateBase} from './xtal-state-base.js';
import {WithPath, with_path} from 'xtal-latx/with-path.js';
import {UrlFormatter} from './url-formatter.js';
import {define} from 'xtal-latx/define.js';
import {debounce} from 'xtal-latx/debounce.js';

const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';

const new$$ = 'new';
/**
 * `xtal-state-commit`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalStateCommit extends UrlFormatter(WithPath(XtalStateBase)) {
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



    // _syncHistory: any;
    // get syncHistory(){
    //     return this._syncHistory;
    // }
    // set syncHistory(nv){
    //     this._syncHistory = nv;
    //     this.value = nv;
    //     this.de('history',{
    //         value: nv
    //     });
    // }


    _new: boolean;
    get new(){
        return this._new;
    }
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
        //this.onPropsChange();
    }
    _debouncer;
    //_connected!: boolean;
    connectedCallback() {
        this._upgradeProperties([make, rewrite, title, 'withPath', 'stringifyFn', new$$, 'syncHistory'].concat([history$]));
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
    
    updateHistory() {
        const hist = this._new ? {} : this.mergedHistory();
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
        if(!url || this._new){
            if(!this._replaceUrlValue || this._new){
                url = this._window.location.href;
            }
        }
        if(!url) return null; 
        url = this.adjustUrl(url);
        if(url === null) return;
        this._window.history[method + 'State'](hist, this._title, url);
    }

}
define(XtalStateCommit);