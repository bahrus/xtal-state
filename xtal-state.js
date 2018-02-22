(function () {
    const setStateAndPush = 'set-state-and-push';
    const setStateAndReplace = 'set-state-and-replace';
    const historyStateChanged = 'history-state-changed';
    /**
     * `xtal-state`
     *  Web component wrapper around the history api
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalState extends HTMLElement {
        //_state: any;
        //_counter = 0;
        get historyState() {
            return window.history.state;
        }
        set historyState(newVal) {
            this.broadastHistoryChange(newVal, false);
        }
        broadastHistoryChange(newVal, fromPopEvent) {
            const newEvent = new CustomEvent(historyStateChanged, {
                detail: {
                    value: newVal,
                    fromPopEvent: fromPopEvent,
                },
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(newEvent);
        }
        get setStateAndPush() {
            return this._push;
        }
        set setStateAndPush(newVal) {
            if (newVal) {
                this.setAttribute(setStateAndPush, '');
            }
            else {
                this.removeAttribute(setStateAndPush);
            }
        }
        get setStateAndReplace() {
            return this._replace;
        }
        set setStateAndReplace(newVal) {
            if (newVal) {
                this.setAttribute(setStateAndReplace, '');
            }
            else {
                this.removeAttribute(setStateAndReplace);
            }
        }
        get source() {
            return this._source;
        }
        set source(newVal) {
            this._source = newVal;
            this.onPropsChange();
        }
        onPropsChange() {
            if (!this._push && !this._replace)
                return;
            if (!this.source)
                return;
            const newState = window.history.state ? Object.assign({}, window.history.state) : {};
            Object.assign(newState, this.source);
            if (this._push) {
                //window.history.pushState(newState, 'p' + this._counter, 'p' + this._counter);
                window.history.pushState(newState, '');
            }
            else {
                //window.history.replaceState(newState, 'r' + this._counter, 'r' + this._counter);
                window.history.replaceState(newState, '');
            }
            //this._counter++;
            this.historyState = newState;
        }
        static get observedAttributes() {
            return [setStateAndPush, setStateAndReplace];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case setStateAndPush:
                    this._push = newValue !== null;
                    //this.onPropsChange();
                    break;
                case setStateAndReplace:
                    this._replace = newValue !== null;
                    break;
            }
            this.onPropsChange();
        }
        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
        connectedCallback() {
            this._upgradeProperty('setStateAndPush');
            this._upgradeProperty('setStateAndReplace');
            const _this = this;
            //window.addEventListener('popstate', this.updateState);
            window.addEventListener('popstate', e => {
                // //debugger;
                // this.updateState(e, _this);
                // _this.historyState = window.history.state; 
                _this.broadastHistoryChange(_this.historyState, true);
            }); //should I be concerned?:  https://jsperf.com/onpopstate-vs-addeventlistener
            this.addEventListener(historyStateChanged, this.updateState);
            this.historyState = window.history.state;
        }
        disconnectedCallback() {
            window.removeEventListener('popstate', this.updateState);
        }
        updateState(e) {
            if (e.type === historyStateChanged && this === e.target)
                return;
            if (e.detail && e.detail.fromPopEvent)
                return;
            //this.historyState = Object.assign({}, window.history.state) ;
            this.historyState = window.history.state;
        }
    }
    customElements.define('xtal-state', XtalState);
})();
//# sourceMappingURL=xtal-state.js.map