import { XtalStateBase } from './xtal-state-base.js';
import { pushState, setState } from './xtal-state-api.js';
import { WithPath, with_path } from 'xtal-element/with-path.js';
import { UrlFormatter } from './url-formatter.js';
import { define } from 'trans-render/define.js';
import { debounce } from 'xtal-element/debounce.js';
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
export class XtalStateUpdate extends UrlFormatter(WithPath(XtalStateBase)) {
    constructor() {
        super(...arguments);
        this._title = '';
        this._queuedHistory = [];
    }
    static get is() { return 'xtal-state-update'; }
    get make() {
        return this._make;
    }
    /**
     * PushState in history
     */
    set make(val) {
        this.attr(make, val, '');
    }
    get rewrite() {
        return this._rewrite;
    }
    /**
     * Replace State into history
     */
    set rewrite(val) {
        this.attr(rewrite, val, '');
    }
    get history() {
        if (this._win === undefined)
            return undefined;
        return this._win.history.state;
    }
    /**
     * Window Context History.State Object to push/replace
     */
    set history(newVal) {
        this._queuedHistory.push(newVal);
        this.onPropsChange();
    }
    get title() {
        return this._title;
    }
    /**
     * Title to use when calling push/replace state
     */
    set title(val) {
        this.attr(title, val);
    }
    get new() {
        return this._new;
    }
    /**
     * Initite history to empty object
     */
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
    }
    connectedCallback() {
        this.propUp([make, rewrite, title, 'withPath', 'stringifyFn', new$$, 'syncHistory'].concat([history$]));
        this._debouncer = debounce(() => {
            this.updateHistory();
        }, 50);
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
            }
        }
        this._debouncer();
    }
    updateHistory() {
        let url = this._url;
        if (url) {
            url = this.adjustUrl(url);
        }
        if (this._rewrite) {
            const hist = this._new ? {} : this._queuedHistory.shift();
            if (hist === null || hist === undefined)
                return;
            setState(this.wrap(hist), this._title, url, this._win);
        }
        else {
            const hist = this._new ? {} : this._queuedHistory.shift();
            if (hist === null || hist === undefined)
                return;
            this._disabled = true;
            pushState(this.wrap(hist), this._title, url, this._win);
            this._disabled = false;
        }
        this.de('history', {
            value: this._win.history.state
        });
        if (this._queuedHistory.length > 0) {
            this._debouncer();
        }
    }
}
define(XtalStateUpdate);
