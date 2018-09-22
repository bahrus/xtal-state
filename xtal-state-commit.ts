//import { XtallatX } from 'xtal-latx/xtal-latx.js';
import {XtalStateBase} from './xtal-state-base.js';

import {define} from 'xtal-latx/define.js';
import {debounce} from 'xtal-latx/debounce.js';
export interface IHistoryUpdatePacket {
    proposedState: any,
    title: string,
    url: string,
    completed?: boolean,
    wherePath?: string,
    customUpdater?: any,
}
const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';
const url = 'url';


/**
 * `xtal-state-commit`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalStateCommit extends XtalStateBase {
    static get is() { return 'xtal-state-commit'; }

    _make!: boolean;
    get make() {
        return this._make;
    }
    set make(newVal) {
        if (newVal !== null) {
            this.setAttribute(make, '');
        } else {
            this.removeAttribute(make);
        }
    }
    _rewrite!: boolean;
    get rewrite() {
        return this._rewrite;
    }
    set rewrite(newVal) {
        if (newVal) {
            this.setAttribute(rewrite, '');
        } else {
            this.removeAttribute(rewrite);
        }
    }
    _history: any;
    get history(){
        return this._window.history.state;
    }
    set history(newVal: any) {
        this._history = newVal;
        this.onPropsChange();
    }
    _title = '';
    get title() {
        return this._title;
    }
    set title(val) {
        this.setAttribute(title, val);
    }
    _url!: string;
    get url() {
        return this._url;
    }

    set url(val) {
        this.setAttribute(url, val);
    }

    static get observedAttributes() {
        //const p = XtalStateUpdate.properties;
        return super.observedAttributes.concat([make, rewrite, title, url]);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        
        switch (name) {
            case rewrite:
            case make:
                this['_' + name] = newValue !== null;
                break;
            case url:
            case title:
                this['_' + name] = newValue;
                break;

        }
        super.attributeChangedCallback(name, oldValue, newValue);
        //this.onPropsChange();
    }
    _debouncer;
    //_connected!: boolean;
    connectedCallback() {
        this._upgradeProperties(XtalStateCommit.observedAttributes.concat([history$]));
        this._debouncer = debounce(() => {
            this.updateHistory();
        }, 50);
        //this._connected = true;
        super.connectedCallback();
    }
    preProcess(stateUpdate: IHistoryUpdatePacket) { }
    onPropsChange() {
        if(super.onPropsChange()) return true;
        if (!this._make && !this._rewrite) return true;
        this._debouncer();
    }

    updateHistory() {
        const method = this.make ? 'push' : 'replace';
        let url = this._url ? this._url : this._window.location; 
        this._window.history[method + 'State'](this._history, this._title, url);
    }
}
define(XtalStateCommit);