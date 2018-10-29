import { XtalStateBase } from './xtal-state-base.js';
import { WithPath, with_path } from 'xtal-latx/with-path.js';
import { define } from 'xtal-latx/define.js';
import { debounce } from 'xtal-latx/debounce.js';
// export interface IHistoryUpdatePacket {
//     proposedState: any,
//     title: string,
//     url: string,
//     completed?: boolean,
//     wherePath?: string,
//     customUpdater?: any,
// }
const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';
const url = 'url';
const url_search = 'url-search';
const replace_url_value = 'replace-url-value';
// function compare(lhs: any, rhs: any){
//     if(!lhs && !rhs) return true;
//     if(!lhs && rhs) return false;
//     if(lhs && !rhs) return false;
//     return JSON.stringify(lhs) === JSON.stringify(rhs);
// }
/**
 * `xtal-state-commit`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalStateCommit extends WithPath(XtalStateBase) {
    constructor() {
        super(...arguments);
        this._title = '';
    }
    static get is() { return 'xtal-state-commit'; }
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
        return this._window.history.state;
    }
    set history(newVal) {
        this._history = newVal;
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
    /**
     * URL to use when calling push/replace state
     */
    get url() {
        return this._url;
    }
    set url(val) {
        this.attr(url, val);
    }
    /**
     * Regular expression to search url for.
     */
    get urlSearch() {
        return this._urlSearch;
    }
    set urlSearch(val) {
        this.attr(url_search, val);
    }
    get stringifyFn() {
        return this._stringifyFn;
    }
    set stringifyFn(nv) {
        this._stringifyFn = nv;
    }
    set syncHistory(nv) {
        this.value = nv;
        this.de('history', {
            value: nv
        });
    }
    /**
     * Replace URL expression, coupled with urlSearch
     */
    get replaceUrlValue() {
        return this._replaceUrlValue;
    }
    set replaceUrlValue(val) {
        this.attr(replace_url_value, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([make, rewrite, title, url, with_path, url_search, replace_url_value]);
    }
    attributeChangedCallback(n, ov, nv) {
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
    //_connected!: boolean;
    connectedCallback() {
        this._upgradeProperties([make, rewrite, title, url, 'withPath', 'urlSearch', 'replaceUrlValue', 'stringifyFn'].concat([history$]));
        this._debouncer = debounce(() => {
            this.updateHistory();
        }, 50);
        //this._connected = true;
        super.connectedCallback();
    }
    onPropsChange() {
        if (this._disabled)
            return;
        if (super.onPropsChange()) {
            if (this._notReady) {
                setTimeout(() => {
                    this.onPropsChange();
                }, 50);
                return;
            }
            return true;
        }
        if (!this._make && !this._rewrite)
            return true;
        this._debouncer();
    }
    mergedHistory() {
        if (this._history === undefined)
            return undefined;
        return this.wrap(this._history);
    }
    updateHistory() {
        const hist = this.mergedHistory();
        if (hist === null || hist === undefined)
            return;
        const method = this.make ? 'push' : 'replace';
        //const bH = this._window.history;
        //if(compare(bH.state, hist)) return;
        this.value = hist;
        this._disabled = true;
        this.de('history', {
            value: hist
        });
        this._disabled = false;
        if (this.make && !this.url)
            return;
        let url = this._url;
        if (!url) {
            if (!this._replaceUrlValue) {
                url = this._window.location.href;
            }
        }
        if (!url)
            return;
        if (this._stringifyFn) {
            url = this._stringifyFn(this);
        }
        else if (this._replaceUrlValue && this._urlSearch) {
            const reg = new RegExp(this._urlSearch);
            url = url.replace(reg, this._replaceUrlValue);
        }
        this._window.history[method + 'State'](hist, this._title, url);
    }
}
define(XtalStateCommit);
//# sourceMappingURL=xtal-state-commit.js.map