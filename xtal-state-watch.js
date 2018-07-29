import { XtallatX } from 'xtal-latx/xtal-latx.js';
const wherePath1 = 'where-path';
const watch = 'watch';
const subscribers = [];
export class XtalStateWatch extends XtallatX(HTMLElement) {
    static get is() { return 'xtal-state-watch'; }
    constructor() {
        super();
        subscribers.push(this);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([watch, wherePath1]);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case watch:
                this._watch = newValue !== null;
                //this.notify();
                break;
            case wherePath1:
                this._wherePath = newValue;
                //this.notify();
                break;
        }
        this.notify();
    }
    connectedCallback() {
        this._connected = true;
        this.notify();
    }
    get derivedHistory() {
        return this.filter();
    }
    get history() {
        return this._history;
    }
    set history(newVal) {
        this._history = newVal;
        if (this.watch)
            this.notify();
    }
    get watch() { return this._watch; }
    set watch(newVal) {
        if (newVal) {
            this.setAttribute(watch, '');
        }
        else {
            this.removeAttribute(watch);
        }
    }
    get wherePath() { return this._wherePath; }
    set wherePath(val) {
        this.setAttribute(wherePath1, val);
    }
    filter() {
        if (!this._wherePath)
            return window.history.state;
        let obj = window.history.state;
        const paths = this._wherePath.split('.');
        let idx = 0;
        const len = paths.length;
        while (obj && idx < len) {
            obj = obj[paths[idx++]];
        }
        return obj;
    }
    notify() {
        if (!this._watch || this._disabled || !this._connected)
            return;
        const newVal = this.filter();
        const historyNotificationPacket = {
            rawHistoryObject: newVal,
            detailedHistoryObject: null,
            wherePath: this._wherePath,
            customInjector: null,
            isInvalid: false
        };
        const dataInjectionEvent = {
            value: historyNotificationPacket
        };
        this.de('raw-history', dataInjectionEvent);
        const returnDetail = dataInjectionEvent.value;
        if (returnDetail.isInvalid)
            return;
        if (returnDetail.customInjector) {
            const result = returnDetail.customInjector(historyNotificationPacket);
            if (typeof result['then'] === 'function') {
                result['then'](() => {
                    this.de('derived-history', { value: returnDetail.detailedHistoryObject || returnDetail.rawHistoryObject });
                });
                return;
            }
        }
        this.de('derived-history', { value: returnDetail.detailedHistoryObject || returnDetail.rawHistoryObject });
    }
}
if (!customElements.get(XtalStateWatch.is))
    customElements.define(XtalStateWatch.is, XtalStateWatch);
const originalPushState = history.pushState;
const boundPushState = originalPushState.bind(history);
history.pushState = function (newState, title, URL) {
    boundPushState(newState, title, URL);
    subscribers.forEach(subscriber => {
        subscriber.history = newState;
    });
};
const originalReplaceState = history.replaceState;
const boundReplaceState = originalReplaceState.bind(history);
history.replaceState = function (newState, title, URL) {
    boundReplaceState(newState, title, URL);
    subscribers.forEach(subscriber => {
        subscriber.history = newState;
    });
};
window.addEventListener('popstate', e => {
    subscribers.forEach(subscriber => {
        subscriber.history = history.state;
    });
});
//# sourceMappingURL=xtal-state-watch.js.map