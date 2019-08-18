import { XtalStateBase } from './xtal-state-base.js';
import { history_state_update } from './xtal-state-base-api.js';
import { define } from 'trans-render/define.js';
const watch = 'watch';
const all = 'all';
const xtal_subscribers = 'xtal-subscribers';
const popstate = 'popstate';
//const once = 'once';
function remove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
export class XtalStateWatch extends XtalStateBase {
    static get is() { return 'xtal-state-watch'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([watch]);
    }
    attributeChangedCallback(name, oldValue, nv) {
        super.attributeChangedCallback(name, oldValue, nv);
        switch (name) {
            case watch:
                this._watch = (nv === '') ? all : popstate;
                break;
        }
        this.notify();
    }
    pushReplaceHandler(e) {
        const win = this._window;
        const detail = e.detail;
        //if(detail.newState && win.__xtalStateInfo.startedAsNull && !win.__xtalStateInfo.hasStarted){
        if (detail.initVal) {
            //win.__xtalStateInfo.hasStarted;
            this.dataset.historyInit = 'true';
            this.dataset.popstate = 'true';
        }
        else {
            delete this.dataset.popstate;
            delete this.dataset.historyInit;
        }
        this.history = this._window.history.state;
    }
    popStateHandler(e) {
        this.dataset.popstate = 'true';
        this.history = this._window.history.state;
    }
    addSubscribers() {
        if (this._notReady) {
            setTimeout(() => {
                this.addSubscribers();
            }, 50);
            return;
        }
        switch (this._watch) {
            case all:
            case popstate:
                if (!this._boundPushReplaceListener) {
                    this._boundPushReplaceListener = this.pushReplaceHandler.bind(this);
                    this._window.addEventListener(history_state_update, this._boundPushReplaceListener);
                }
        }
        switch (this._watch) {
            case popstate:
                if (!this._boundPopStateListener) {
                    this._boundPopStateListener = this.popStateHandler.bind(this);
                    this._window.addEventListener(popstate, this._boundPopStateListener);
                }
        }
        this._connected = true;
        this.history = this._window.history.state;
        //this.notify();
    }
    connectedCallback() {
        //this._connected = true;
        this.propUp([watch]);
        super.connectedCallback();
        this.addSubscribers();
    }
    disconnect() {
        if (this._boundPopStateListener)
            this.removeEventListener(popstate, this._boundPopStateListener);
        if (this._boundPushReplaceListener)
            this.removeEventListener(history_state_update, this._boundPushReplaceListener);
    }
    disconnectedCallback() {
        this.disconnect();
    }
    get history() {
        return this._history;
    }
    set history(newVal) {
        this._history = newVal;
        if (this._watch)
            this.notify();
    }
    get watch() { return this._watch; }
    set watch(nv) {
        this.attr(watch, nv);
    }
    notify() {
        if (!this._watch || this._disabled || !this._connected || this._history === undefined || this._history === null)
            return;
        this.de('history', {
            value: this._history,
        });
    }
}
define(XtalStateWatch);
