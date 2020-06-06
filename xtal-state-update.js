import { XtalStateBase } from './xtal-state-base.js';
import { pushState, setState } from './xtal-state-api.js';
import { WithPath } from 'xtal-element/with-path.js';
import { UrlFormatter } from './url-formatter.js';
import { debounce } from 'xtal-element/debounce.js';
import { define } from 'xtal-element/xtal-latx.js';
/**
 * Web component wrapper around the history api
 * @element xtal-state-update
 *
 *
 */
let XtalStateUpdate = /** @class */ (() => {
    class XtalStateUpdate extends UrlFormatter(WithPath(XtalStateBase)) {
        constructor() {
            super(...arguments);
            this._queuedHistory = [];
            this.propActions = this.propActions.concat([
                ({ disabled, self }) => {
                    if (!self._init) {
                        self._init = true;
                        if (self._storeKeeper) {
                            self._storeKeeper.getContextWindow().then(win => {
                                self._win = win;
                                self.onPropsChange('disabled');
                            });
                            return;
                        }
                        else {
                            self._win = window;
                        }
                    }
                }
            ]);
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
            if (this._debouncer !== undefined)
                this._debouncer();
        }
        connectedCallback() {
            this._debouncer = debounce(() => {
                this.updateHistory();
            }, 50);
            super.connectedCallback();
        }
        async updateHistory() {
            let url = this.url;
            if (url) {
                url = this.adjustUrl(url);
            }
            if (this.rewrite) {
                const hist = this.new ? {} : this._queuedHistory.shift();
                if (hist === null || hist === undefined)
                    return;
                await setState(this.wrap(hist), this.title !== undefined ? this.title : '', url, this._win);
            }
            else {
                const hist = this.new ? {} : this._queuedHistory.shift();
                if (hist === null || hist === undefined)
                    return;
                this.disabled = true;
                await pushState(this.wrap(hist), this.title !== undefined ? this.title : '', url, this._win);
                this.disabled = false;
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
    XtalStateUpdate.attributeProps = ({ make, rewrite, history, disabled, guid, url, urlSearch, replaceUrlValue, stringifyFn, withPath }) => {
        const bool = [disabled, make, rewrite];
        const obj = [history, stringifyFn];
        const str = [guid, url, urlSearch, replaceUrlValue, withPath];
        const reflect = [...bool, ...str];
        return { bool, obj, str };
    };
    return XtalStateUpdate;
})();
export { XtalStateUpdate };
define(XtalStateUpdate);
