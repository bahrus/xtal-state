import { XtalStateBase } from './xtal-state-base.js';
import { pushState, setState } from './xtal-state-api.js';
import { WithPath, with_path } from 'xtal-element/with-path.js';
import { UrlFormatter } from './url-formatter.js';
import { define } from 'trans-render/define.js';
import { debounce } from 'xtal-element/debounce.js';
const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';
const new$$ = 'new';
/**
 * `xtal-state-update`
 * Web component wrapper around the history api
 *
 */
export class XtalStateUpdate extends UrlFormatter(WithPath(XtalStateBase)) {
    constructor() {
        super(...arguments);
        this._title = '';
    }
    static get is() { return 'xtal-state-update'; }
    /**
     * PushState in history
     */
    get make() {
        return this._make;
    }
    set make(val) {
        this.attr(make, val, '');
    }
    /**
     * ReplaceState in history
     */
    get rewrite() {
        return this._rewrite;
    }
    set rewrite(val) {
        this.attr(rewrite, val, '');
    }
    /**
     * Window Context History Object
     */
    get history() {
        if (this._win === undefined)
            return undefined;
        return this._win.history.state;
    }
    set history(newVal) {
        this._history = newVal;
        this._queuedHistory.push(newVal);
        this.onPropsChange();
    }
    /**
     * Title to use when calling push/replace state
     */
    get title() {
        return this._title;
    }
    set title(val) {
        this.attr(title, val);
    }
    get new() {
        return this._new;
    }
    set new(v) {
        this.attr(new$$, v, '');
    }
    static get observedAttributes() {
        return super.observedAttributes.concat(super.UFAttribs).concat([make, rewrite, title, with_path, new$$]);
    }
    attributeChangedCallback(n, ov, nv) {
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
    //_connected!: boolean;
    connectedCallback() {
        this.propUp([make, rewrite, title, 'withPath', 'stringifyFn', new$$, 'syncHistory'].concat([history$]));
        this._debouncer = debounce(() => {
            this.updateHistory();
        }, 50);
        //this._connected = true;
        super.connectedCallback();
    }
    onPropsChange() {
        if (!super.onPropsChange())
            return false;
        if (!this._make && !this._rewrite)
            return false;
        if (!this._init) {
            this._init = true;
            if (this._storeKeeper) {
                this._storeKeeper.getContextWindow().then(win => {
                    this._win = win;
                    //init(win);
                    this.onPropsChange();
                });
                return;
            }
            else {
                this._win = window;
                //init(window);
            }
        }
        this._debouncer();
    }
    mergedHistory() {
        if (this._history === undefined)
            return undefined;
        return this.wrap(this._history);
    }
    updateHistory() {
        if (this._rewrite) {
            const hist = this._new ? {} : this._queuedHistory.pop();
            if (hist === null || hist === undefined)
                return;
            setState(hist, this._title, this._win);
        }
        else {
            if (this.make && !this.url)
                return;
            let url = this._url;
            if (!url || this._new) {
                if (!this._replaceUrlValue || this._new) {
                    url = this._win.location.href;
                }
            }
            if (!url)
                return null;
            url = this.adjustUrl(url);
            if (url === null)
                return;
            const hist = this._new ? {} : this._queuedHistory.pop();
            if (hist === null || hist === undefined)
                return;
            this._disabled = true;
            pushState(hist, this._title, url, this._win);
            this.de('history', {
                value: this._win.history.state
            });
            this._disabled = false;
        }
    }
}
define(XtalStateUpdate);
