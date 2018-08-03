import { XtallatX } from 'xtal-latx/xtal-latx.js';
const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';
const url = 'url';
export const debounce = (fn, time) => {
    let timeout;
    return function () {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};
/**
 * `xtal-state-commit`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalStateCommit extends XtallatX(HTMLElement) {
    static get is() { return 'xtal-state-commit'; }
    get make() {
        return this._make;
    }
    set make(newVal) {
        if (newVal !== null) {
            this.setAttribute(make, '');
        }
        else {
            this.removeAttribute(make);
        }
    }
    get rewrite() {
        return this._rewrite;
    }
    set rewrite(newVal) {
        if (newVal) {
            this.setAttribute(rewrite, '');
        }
        else {
            this.removeAttribute(rewrite);
        }
    }
    namespaceHistory(history) {
        return history;
    }
    set history(newVal) {
        this._namespacedHistoryUpdate = this.namespaceHistory(newVal);
        this.onPropsChange();
    }
    get title() {
        return this._title;
    }
    set title(val) {
        this.setAttribute(title, val);
    }
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
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
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
        this.onPropsChange();
    }
    connectedCallback() {
        this._upgradeProperties(XtalStateCommit.observedAttributes.concat([history$]));
        this._debouncer = debounce((stateUpdate) => {
            this.updateHistory(stateUpdate);
        }, 50);
        this._connected = true;
        this.onPropsChange();
    }
    preProcess(stateUpdate) { }
    onPropsChange() {
        if (this._disabled || !this._connected || (!this._make && !this._rewrite) || !this._namespacedHistoryUpdate)
            return;
        const stateUpdate = {
            proposedState: this._namespacedHistoryUpdate,
            url: this._url,
            title: this._title,
        };
        this.preProcess(stateUpdate);
        if (!stateUpdate.completed) {
            this._debouncer(stateUpdate);
        }
    }
    updateHistory(detail) {
        const method = this.make ? 'push' : 'replace';
        window.history[method + 'State'](detail.proposedState, detail.title ? detail.title : '', detail.url);
    }
}
if (!customElements.get(XtalStateCommit.is))
    customElements.define(XtalStateCommit.is, XtalStateCommit);
//# sourceMappingURL=xtal-state-commit.js.map