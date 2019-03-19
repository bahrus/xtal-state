
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
        else if (parent.tagName.indexOf('-') > -1) {
            return parent;
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
        initVal: false
    };
    const historyInfo = win.__xtalStateInfo;
    if (!historyInfo.hasStarted) {
        historyInfo.hasStarted = true;
        if (historyInfo.startedAsNull) {
            detail.initVal = true;
        }
    }
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
    if (!win.__xtalStateInfo) {
        win.__xtalStateInfo = {
            startedAsNull: win.history.state === null,
        };
    }
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

const debounce = (fn, time) => {
    let timeout;
    return function () {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};

function createNestedProp(target, pathTokens, val, clone) {
    const firstToken = pathTokens.shift();
    const tft = target[firstToken];
    const returnObj = { [firstToken]: tft ? tft : {} };
    let tc = returnObj[firstToken]; //targetContext
    const lastToken = pathTokens.pop();
    pathTokens.forEach(token => {
        let newContext = tc[token];
        if (!newContext) {
            newContext = tc[token] = {};
        }
        tc = newContext;
    });
    if (tc[lastToken] && typeof (val) === 'object') {
        Object.assign(tc[lastToken], val);
    }
    else {
        if (lastToken === undefined) {
            returnObj[firstToken] = val;
        }
        else {
            tc[lastToken] = val;
        }
    }
    //this controversial line is to force the target to see new properties, even though we are updating nested properties.
    //In some scenarios, this will fail (like if updating element.dataset), but hopefully it's okay to ignore such failures 
    if (clone)
        try {
            Object.assign(target, returnObj);
        }
        catch (e) { }
    ;
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
                createNestedProp(mergedObj, this._withPath.split('.'), obj, true);
                return mergedObj;
                // const retObj = mergedObj;
                // const splitPath = this._withPath.split('.');
                // const lenMinus1 = splitPath.length - 1;
                // splitPath.forEach((pathToken, idx) => {
                //     if(idx === lenMinus1){
                //         mergedObj[pathToken] = obj;
                //     }else{
                //         mergedObj = mergedObj[pathToken] = {};
                //     }
                // })
                // return retObj;
            }
            else {
                return obj;
            }
        }
    };
}

/**
 * Deep merge two objects.
 * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
 * @param target
 * @param source
 *
 */
function mergeDeep(target, source) {
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
                        mergeDeep(targetVal, sourceVal);
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

const url = 'url';
const url_search = 'url-search';
const replace_url_value = 'replace-url-value';
function UrlFormatter(superClass) {
    return class extends superClass {
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
        get stringifyFn() {
            return this._stringifyFn;
        }
        set stringifyFn(nv) {
            this._stringifyFn = nv;
        }
        static get UFAttribs() {
            return [url, url_search, replace_url_value];
        }
        attributeChangedCallback(n, ov, nv) {
            switch (n) {
                case url:
                    this['_' + n] = nv;
                    break;
                case url_search:
                    this._urlSearch = nv;
                    break;
                case replace_url_value:
                    this._replaceUrlValue = nv;
                    break;
            }
            if (super.attributeChangedCallback)
                super.attributeChangedCallback(n, ov, nv);
        }
        connectedCallback() {
            this._upgradeProperties([url, 'urlSearch', 'replaceUrlValue', 'stringifyFn']);
            if (super.connectedCallback)
                super.connectedCallback();
        }
        adjustUrl(url) {
            if (this._stringifyFn) {
                url = this._stringifyFn(this);
            }
            else if (this._replaceUrlValue && this._urlSearch) {
                const reg = new RegExp(this._urlSearch);
                url = url.replace(reg, this._replaceUrlValue);
            }
            return url;
        }
    };
}

const make = 'make';
const rewrite = 'rewrite';
const history$ = 'history';
//const wherePath = 'where-path';
const title = 'title';
const new$$ = 'new';
/**
 * `xtal-state-commit`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalStateCommit extends UrlFormatter(WithPath(XtalStateBase)) {
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
    get new() {
        return this._new;
    }
    set new(v) {
        this.attr(new$$, v, '');
    }
    static get observedAttributes() {
        return super.observedAttributes.concat(super.UFAttribs).concat([make, rewrite, title, with_path, new$$]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case new$$:
            case rewrite:
            case make:
                this['_' + n] = nv !== null;
                break;
            case title:
                this['_' + n] = nv;
                break;
            case with_path:
                this._withPath = nv;
                break;
        }
        super.attributeChangedCallback(n, ov, nv);
        //this.onPropsChange();
    }
    //_connected!: boolean;
    connectedCallback() {
        this._upgradeProperties([make, rewrite, title, 'withPath', 'stringifyFn', new$$, 'syncHistory'].concat([history$]));
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
        const hist = this._new ? {} : this.mergedHistory();
        if (hist === null || hist === undefined)
            return;
        const method = this.make ? 'push' : 'replace';
        //const bH = this._window.history;
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
        if (!url || this._new) {
            if (!this._replaceUrlValue || this._new) {
                url = this._window.location.href;
            }
        }
        if (!url)
            return null;
        url = this.adjustUrl(url);
        if (url === null)
            return;
        this._window.history[method + 'State'](hist, this._title, url);
    }
}
define(XtalStateCommit);

class XtalStateUpdate extends XtalStateCommit {
    static get is() { return 'xtal-state-update'; }
    mergedHistory() {
        const sm = super.mergedHistory();
        if (sm === undefined)
            return undefined;
        if (this._window.history.state === null)
            return sm;
        const retObj = Object.assign({}, this._window.history.state);
        return mergeDeep(retObj, this.wrap(this._history));
    }
}
define(XtalStateUpdate);

    })();  
        