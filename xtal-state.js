(function () {
    const setStateAndPush = 'set-state-and-push';
    const setStateAndReplace = 'set-state-and-replace';
    class XtalState extends HTMLElement {
        //_state: any;
        get state() {
            return window.history.state;
        }
        set state(newVal) {
            const newEvent = new CustomEvent('state-changed', {
                detail: {
                    value: newVal,
                },
                bubbles: true,
                composed: false
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
                window.history.pushState(newState, '');
            }
            else {
                window.history.replaceState(newState, '');
            }
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
            window.addEventListener('popstate', this.updateState); //should I be concerned?:  https://jsperf.com/onpopstate-vs-addeventlistener
        }
        disconnectedCallback() {
            window.removeEventListener('popstate', this.updateState);
        }
        updateState() {
            this.state = window.history.state;
        }
    }
    customElements.define('xtal-state', XtalState);
})();
//# sourceMappingURL=xtal-state.js.map