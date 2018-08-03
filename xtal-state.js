
    //@ts-check
    (function () {
    const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr(name, ec[name].toString());
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
//# sourceMappingURL=xtal-latx.js.map
const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';
const url = 'url';
const debounce = (fn, time) => {
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
class XtalStateCommit extends XtallatX(HTMLElement) {
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
const wherePath2 = 'where-path';
class XtalStateUpdate extends XtalStateCommit {
    static get is() { return 'xtal-state-update'; }
    get wherePath() { return this._wherePath; }
    set wherePath(val) {
        this.setAttribute(wherePath2, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([wherePath2]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case wherePath2:
                this._wherePath = newVal;
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    namespaceHistory(history) {
        if (!this._wherePath)
            return history;
        const returnObj = {};
        let currPath = returnObj;
        const tokens = this._wherePath.split('.');
        const len = tokens.length - 1;
        let count = 0;
        tokens.forEach(path => {
            currPath[path] = count === len ? this._namespacedHistoryUpdate : {};
            currPath = currPath[path];
            count++;
        });
        return returnObj;
    }
    mergeDeep(target, source) {
        if (typeof target !== 'object')
            return;
        if (typeof source !== 'object')
            return;
        for (const key in source) {
            const sourceVal = source[key];
            const targetVal = target[key];
            if (!sourceVal)
                continue; //TODO:  null out property?
            if (!targetVal) {
                target[key] = sourceVal;
                continue;
            }
            switch (typeof sourceVal) {
                case 'object':
                    switch (typeof targetVal) {
                        case 'object':
                            this.mergeDeep(targetVal, sourceVal);
                            break;
                        default:
                            //console.log(key);
                            target[key] = sourceVal;
                            break;
                    }
                    break;
                default:
                    target[key] = sourceVal;
            }
        }
        return target;
    }
    preProcess(stateUpdate) {
        stateUpdate.wherePath = this._wherePath;
        XtalStateUpdate._lastPath = this._wherePath;
        this.de('pre-history-merge', {
            value: stateUpdate
        });
        if (!stateUpdate.completed) {
            if (stateUpdate.customUpdater) {
                stateUpdate.completed = true;
                const update = stateUpdate.customUpdater(stateUpdate);
                if (update.proposedState['then'] && typeof (update.proposedState['then'] === 'function')) {
                    update['then']((newDetail) => {
                        this._debouncer(newDetail);
                    });
                    return;
                }
            }
            else {
                let newState = window.history.state ? Object.assign({}, window.history.state) : {};
                this.mergeDeep(newState, this._namespacedHistoryUpdate);
            }
        }
    }
}
if (!customElements.get(XtalStateUpdate.is)) {
    customElements.define(XtalStateUpdate.is, XtalStateUpdate);
}
//# sourceMappingURL=xtal-state-update.js.map
const wherePath1 = 'where-path';
const watch = 'watch';
const subscribers = [];
class XtalStateWatch extends XtallatX(HTMLElement) {
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
    })();  
        