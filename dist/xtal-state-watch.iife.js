
    //@ts-check
    (function () {
    function define(custEl) {
    let tagName = custEl.is;
    if (customElements.get(tagName)) {
        console.warn('Already registered ' + tagName);
        return;
    }
    customElements.define(tagName, custEl);
}
const disabled = 'disabled';
/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        /**
         * Any component that emits events should not do so if it is disabled.
         * Note that this is not enforced, but the disabled property is made available.
         * Users of this mix-in should ensure not to call "de" if this property is set to true.
         */
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Turn number into string with even and odd values easy to query via css.
         * @param n
         */
        to$(n) {
            const mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
        }
        /**
         * Increment event count
         * @param name
         */
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr('data-' + name, this.to$(ec[name]));
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        /**
         * Dispatch Custom Event
         * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
         * @param detail Information to be passed with the event
         * @param asIs If true, don't append event name with '-changed'
         */
        de(name, detail, asIs = false) {
            const eventName = name + (asIs ? '' : '-changed');
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         */
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
function getHost(el) {
    let parent = el;
    while (parent = (parent.parentNode)) {
        if (parent.nodeType === 11) {
            return parent['host'];
        }
        else if (parent.tagName === 'BODY') {
            return null;
        }
    }
    return null;
}
const history_state_update = 'history-state-update';
/**
 *
 * @param par Parent or document fragment which should mantain regional state
 * @param _t XtalStateBase element
 */
function getIFrmWin(par, callBack) {
    let ifr = par.querySelector('iframe[xtal-state]');
    if (ifr === null) {
        ifr = document.createElement('iframe');
        //ifr.src = 'about:blank';
        ifr.setAttribute('xtal-state', '');
        ifr.addEventListener('load', () => {
            ifr.setAttribute('loaded', '');
            if (callBack !== null)
                callBack(ifr);
        });
        ifr.src = 'blank.html';
        ifr.style.display = 'none';
        par.appendChild(ifr);
    }
    else {
        if (!ifr.hasAttribute('loaded')) {
            ifr.addEventListener('load', () => {
                if (callBack !== null)
                    callBack(ifr);
            });
        }
        else {
            if (callBack !== null)
                callBack(ifr);
        }
    }
    return ifr.contentWindow;
}
function getMchPar(el, level) {
    let test = el.parentElement;
    while (test) {
        if (test.matches(level))
            return test;
        test = test.parentElement;
    }
}
function getSC(el) {
    const test = getHost(el);
    return test.shadowRoot === null ? test : test.shadowRoot;
}
function getWinCtx(el, level) {
    const _t = this;
    return new Promise((resolve, reject) => {
        switch (level) {
            case "global":
                init(self);
                resolve(self);
                break;
            case "local":
                getIFrmWin(el.parentElement, ifrm => {
                    init(ifrm.contentWindow);
                    resolve(ifrm.contentWindow);
                });
                break;
            case "shadow":
                getIFrmWin(getSC(el), ifrm => {
                    init(ifrm.contentWindow);
                    resolve(ifrm.contentWindow);
                });
                break;
            default:
                getIFrmWin(getMchPar(el, level), ifrm => {
                    init(ifrm.contentWindow);
                    resolve(ifrm.contentWindow);
                });
        }
    });
}
function de(oldState, win) {
    const detail = {
        oldState: oldState,
        newState: win.history.state,
    };
    const newEvent = new CustomEvent(history_state_update, {
        detail: detail,
        bubbles: true,
        composed: true,
    });
    win.dispatchEvent(newEvent);
}
function init(win) {
    if (win.__xtalStateInit)
        return;
    win.__xtalStateInit = true;
    const originalPushState = win.history.pushState;
    const boundPushState = originalPushState.bind(win.history);
    win.history.pushState = function (newState, title, URL) {
        const oldState = win.history.state;
        boundPushState(newState, title, URL);
        de(oldState, win);
    };
    const originalReplaceState = win.history.replaceState;
    const boundReplaceState = originalReplaceState.bind(win.history);
    win.history.replaceState = function (newState, title, URL) {
        const oldState = win.history.state;
        boundReplaceState(newState, title, URL);
        de(oldState, win);
    };
}
const level = 'level';
class XtalStateBase extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._level = 'global';
    }
    get level() {
        return this._level;
    }
    set level(val) {
        this.attr(level, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([level]);
    }
    get window() {
        return this._window;
    }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch (name) {
            case level:
                this._level = newVal;
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties(['disabled', level]);
        this._conn = true;
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._conn || this._disabled)
            return true;
        if (!this._window) {
            this._notReady = true;
            getWinCtx(this, this._level).then((win) => {
                this._window = win;
                this._notReady = false;
            });
        }
        if (this._notReady)
            return true;
    }
}
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
class XtalStateWatch extends XtalStateBase {
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
        if (detail.newState && win.__xtalStateInfo.startedAsNull && !win.__xtalStateInfo.hasStarted) {
            win.__xtalStateInfo.hasStarted;
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
        const win = this._window;
        if (!win.__xtalStateInfo) {
            win.__xtalStateInfo = {
                startedAsNull: win.history.state === null,
            };
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
        this._upgradeProperties([watch]);
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
    })();  
        