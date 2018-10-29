import { XtalStateBase } from './xtal-state-base.js';
import { define } from 'xtal-latx/define.js';
const watch = 'watch';
const xtal_subscribers = 'xtal-subscribers';
//const once = 'once';
function remove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
export class XtalStateWatch extends XtalStateBase {
    static get is() { return 'xtal-state-watch'; }
    constructor() {
        super();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([watch]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case watch:
                this['_' + name] = newValue !== null;
                break;
        }
        this.notify();
    }
    addSubscribers() {
        if (this._notReady) {
            setTimeout(() => {
                this.addSubscribers();
            }, 50);
            return;
        }
        const win = this._window;
        if (!win[xtal_subscribers]) {
            win[xtal_subscribers] = [];
            const originalPushState = win.history.pushState;
            const boundPushState = originalPushState.bind(win.history);
            win.history.pushState = function (newState, title, URL) {
                boundPushState(newState, title, URL);
                win[xtal_subscribers].forEach(subscriber => {
                    subscriber.history = newState;
                });
            };
            const originalReplaceState = win.history.replaceState;
            const boundReplaceState = originalReplaceState.bind(win.history);
            win.history.replaceState = function (newState, title, URL) {
                boundReplaceState(newState, title, URL);
                win[xtal_subscribers].forEach(subscriber => {
                    delete subscriber.dataset.popstate;
                    subscriber.history = newState;
                });
            };
            win.addEventListener('popstate', e => {
                win[xtal_subscribers].forEach(subscriber => {
                    subscriber.dataset.popstate = 'true';
                    subscriber.history = win.history.state;
                });
            });
        }
        this._window[xtal_subscribers].push(this);
        this._connected = true;
        this.history = this._window.history.state;
        //this.notify();
    }
    connectedCallback() {
        //this._connected = true;
        this._upgradeProperties([watch]);
        super.connectedCallback();
        this.addSubscribers();
    }
    disconnect() {
        if (this._window) {
            const subs = this._window[xtal_subscribers];
            if (subs)
                remove(subs, this);
        }
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
        this.attr(watch, nv, '');
    }
    // _once!: boolean;
    // get once(){return this._once;}
    // set once(nv){
    //     this.attr(once, nv, '');
    // }
    notify() {
        if (!this._watch || this._disabled || !this._connected || this._history === undefined)
            return;
        //if(this._once && Object.keys(this._history).length === 0) return;
        const kl = Object.keys(this._history).length;
        const ds = this.dataset;
        if (kl > 0) {
            if (!ds.count) {
                ds.init = "true";
                ds.count = "1";
            }
            else {
                delete ds.init;
                ds.count = (parseInt(ds.count) + 1).toString();
            }
        }
        this.de('history', {
            value: this._history,
        });
        //if(this._history && this._once) this.disconnect();
    }
}
define(XtalStateWatch);
//# sourceMappingURL=xtal-state-watch.js.map