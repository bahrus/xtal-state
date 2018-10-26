
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
const debounce = (fn, time) => {
    let timeout;
    return function () {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};
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
        de(name, detail, asIs) {
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
const with_path = 'with-path';
/**
 * Custom Element mixin that allows a property to be namespaced
 * @param superClass
 */
function WithPath(superClass) {
    return class extends superClass {
        /**
        * @type {string}
        * object inside a new empty object, with key equal to this value.
        * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
        * and with-path = 'myPath'
        * then the source object which be merged into is:
        * {myPath: {foo: 'hello', bar: 'world'}}
        */
        get withPath() {
            return this._withPath;
        }
        set withPath(val) {
            this.setAttribute(with_path, val);
        }
        wrap(obj) {
            if (this._withPath) {
                let mergedObj = {};
                const retObj = mergedObj;
                const splitPath = this._withPath.split('.');
                const lenMinus1 = splitPath.length - 1;
                splitPath.forEach((pathToken, idx) => {
                    if (idx === lenMinus1) {
                        mergedObj[pathToken] = obj;
                    }
                    else {
                        mergedObj = mergedObj[pathToken] = {};
                    }
                });
                return retObj;
            }
            else {
                return obj;
            }
        }
    };
}
const level = 'level';
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
function getWinCtx(el, level) {
    return new Promise((resolve, reject) => {
        switch (level) {
            case "global":
                resolve(self);
                break;
            case "local":
                getIFrmWin(el.parentElement, ifrm => resolve(ifrm.contentWindow));
                break;
            case "shadow":
                this._window = getIFrmWin(getHost(this), ifrm => resolve(ifrm.contentWindow));
                break;
            default:
                this._window = getIFrmWin(getMchPar(el, level), ifrm => resolve(ifrm.contentWindow));
        }
    });
}
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
    // getMchPar(){
    //     let test = this.parentElement;
    //     while(test){
    //         if(test.matches(this.level)) return test;
    //         test = test.parentElement;
    //     }
    // }
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
class XtalStateCommit extends WithPath(XtalStateBase) {
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
        this._upgradeProperties([make, rewrite, title, url, 'withPath', 'urlSearch', 'replaceUrlValue'].concat([history$]));
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
        const bH = this._window.history;
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
        if (this._replaceUrlValue && this._urlSearch) {
            const reg = new RegExp(this._urlSearch);
            url = url.replace(reg, this._replaceUrlValue);
        }
        this._window.history[method + 'State'](hist, this._title, url);
    }
}
define(XtalStateCommit);
class XtalStateUpdate extends XtalStateCommit {
    static get is() { return 'xtal-state-update'; }
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
    mergedHistory() {
        const sm = super.mergedHistory();
        if (sm === undefined)
            return undefined;
        if (this._window.history.state === null)
            return sm;
        const retObj = Object.assign({}, this._window.history.state);
        return this.mergeDeep(retObj, this.wrap(this._history));
    }
}
define(XtalStateUpdate);
const watch = 'watch';
const xtal_subscribers = 'xtal-subscribers';
class XtalStateWatch extends XtalStateBase {
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
                this._watch = newValue !== null;
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
                    subscriber.history = newState;
                });
            };
            win.addEventListener('popstate', e => {
                win[xtal_subscribers].forEach(subscriber => {
                    subscriber.history = history.state;
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
        super.connectedCallback();
        this.addSubscribers();
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
    set watch(newVal) {
        this.attr(watch, newVal, '');
    }
    notify() {
        if (!this._watch || this._disabled || !this._connected || this._history === undefined)
            return;
        this.de('history', {
            value: this._history,
        });
    }
}
define(XtalStateWatch);
const with_url_pattern = 'with-url-pattern';
const parse = 'parse';
const init_history_if_null = 'init-history-if-null';
class XtalStateParse extends XtalStateBase {
    static get is() { return 'xtal-state-parse'; }
    static get observedAttributes() { return super.observedAttributes.concat([with_url_pattern, parse, init_history_if_null]); }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch (name) {
            case with_url_pattern:
                this._withURLPattern = newVal;
                break;
            case parse:
                this['_' + name] = newVal;
                break;
            default:
                super.attributeChangedCallback(name, oldVal, newVal);
                return;
        }
        this.onParsePropsChange();
    }
    get withURLPattern() {
        return this._withURLPattern;
    }
    set withURLPattern(val) {
        this.attr(with_url_pattern, val);
    }
    get parse() {
        return this._parse;
    }
    set parse(val) {
        this.attr(parse, val);
    }
    get initHistoryIfNull() {
        return this._initHistoryIfNull;
    }
    set initHistoryIfNull(nv) {
        this.attr(init_history_if_null, nv, '');
    }
    connectedCallback() {
        this._upgradeProperties(['withURLPattern', parse, 'initHistoryIfNull']);
        super.connectedCallback();
        this.onParsePropsChange();
    }
    onPropsChange() {
        if (this._initHistoryIfNull)
            return false;
        return super.onPropsChange();
    }
    get noMatch() {
        return this._noMatch;
    }
    set noMatch(val) {
        this._noMatch = val;
        this.attr('no-match', val.toString());
    }
    onParsePropsChange() {
        if (this._disabled)
            return;
        if (!this._window && this._initHistoryIfNull) {
            setTimeout(() => {
                this.onParsePropsChange();
            }, 50);
            return;
        }
        if (this._initHistoryIfNull && this._window.history.state !== null) {
            return;
        }
        const value = XtalStateParse.parseAddressBar(this._parse, this._withURLPattern);
        if (value === null) {
            this.noMatch = true;
            this.de('no-match', {
                value: true,
            });
            return;
        }
        else {
            this.value = value;
            this.de('value', {
                value: value
            });
        }
        if (this._initHistoryIfNull)
            this._window.history.replaceState(value, '', this._window.location.href);
    }
    static parseAddressBar(parsePath, urlPattern) {
        const reg = new RegExp(urlPattern);
        let thingToParse = self;
        parsePath.split('.').forEach(token => {
            if (thingToParse)
                thingToParse = thingToParse[token];
        });
        const parsed = reg.exec(thingToParse);
        if (!parsed)
            return null;
        return parsed['groups'];
    }
}
define(XtalStateParse);
    })();  
        