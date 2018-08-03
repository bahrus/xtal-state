import { XtallatX } from 'xtal-latx/xtal-latx.js';
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

export const debounce = (fn: (args: any) => void, time: number) => {
    let timeout: any;

    return function () {
        const functionCall = () => fn.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}
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
    namespaceHistory(history: any) {
        return history;
    }
    _namespacedHistoryUpdate: any;
    set history(newVal: any) {
        this._namespacedHistoryUpdate = this.namespaceHistory(newVal);
        this.onPropsChange();
    }
    _title!: string
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
    _debouncer;
    _connected!: boolean;
    connectedCallback() {
        this._upgradeProperties(XtalStateCommit.observedAttributes.concat([history$]));
        this._debouncer = debounce((stateUpdate) => {
            this.updateHistory(stateUpdate);
        }, 50);
        this._connected = true;
        this.onPropsChange();
    }
    preProcess(stateUpdate: IHistoryUpdatePacket) { }
    onPropsChange() {
        if (this._disabled || !this._connected || (!this._make && !this._rewrite) || !this._namespacedHistoryUpdate) return;
        const stateUpdate = {
            proposedState: this._namespacedHistoryUpdate,
            url: this._url,
            title: this._title,
        } as IHistoryUpdatePacket;
        this.preProcess(stateUpdate);
        if (!stateUpdate.completed) {
            this._debouncer(stateUpdate);
            
        }
    }

    updateHistory(detail: IHistoryUpdatePacket) {
        const method = this.make ? 'push' : 'replace';
        (<any>window).history[method + 'State'](detail.proposedState, detail.title ? detail.title : '', detail.url);
    }
}
if (!customElements.get(XtalStateCommit.is)) customElements.define(XtalStateCommit.is, XtalStateCommit);