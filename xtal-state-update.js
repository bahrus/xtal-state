import { XtalStateBase } from './xtal-state-base.js';
import { pushState, setState } from './xtal-state-api.js';
import { WithPath } from 'xtal-element/with-path.js';
import { UrlFormatter } from './url-formatter.js';
import { define } from 'xtal-element/xtal-latx.js';
import { debounce } from 'xtal-element/debounce.js';
/**
 * Web component wrapper around the history api
 * @element xtal-state-update
 *
 *
 */
export class XtalStateUpdate extends UrlFormatter(WithPath(XtalStateBase)) {
    constructor() {
        super(...arguments);
        /**
         * Title to use when calling push/replace state
         */
        this.title = '';
        this._queuedHistory = [];
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
        this.onPropsChange('history');
    }
    connectedCallback() {
        this._debouncer = debounce(() => {
            this.updateHistory();
        }, 50);
        super.connectedCallback();
    }
    onPropsChange(name) {
        super.onPropsChange(name);
        if (!this.make && !this.rewrite)
            return false;
        if (!this._init) {
            this._init = true;
            if (this._storeKeeper) {
                this._storeKeeper.getContextWindow().then(win => {
                    this._win = win;
                    this.onPropsChange(name);
                });
                return;
            }
            else {
                this._win = window;
            }
        }
        if (this._debouncer !== undefined)
            this._debouncer();
    }
    updateHistory() {
        let url = this.url;
        if (url) {
            url = this.adjustUrl(url);
        }
        if (this.rewrite) {
            const hist = this.new ? {} : this._queuedHistory.shift();
            if (hist === null || hist === undefined)
                return;
            setState(this.wrap(hist), this.title, url, this._win);
        }
        else {
            const hist = this.new ? {} : this._queuedHistory.shift();
            if (hist === null || hist === undefined)
                return;
            this._disabled = true;
            pushState(this.wrap(hist), this.title, url, this._win);
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
XtalStateUpdate.is = 'xtal-state-update';
XtalStateUpdate.attributeProps = ({ make, rewrite, history, disabled, guid, url, urlSearch, replaceUrlValue, stringifyFn }) => ({
    bool: [disabled, make, rewrite],
    obj: [history, stringifyFn],
    str: [guid, url, urlSearch, replaceUrlValue],
    reflect: [disabled, make, rewrite, guid, url, urlSearch, replaceUrlValue],
});
define(XtalStateUpdate);
