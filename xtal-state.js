(function () {
    const tagName = 'xtal-state';
    if (customElements.get(tagName))
        return;
    const make = 'make';
    const rewrite = 'rewrite';
    const history = 'history';
    /**
     * `xtal-state`
     *  Web component wrapper around the history push/replace api
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalState extends HTMLElement {
        static get properties() {
            return [make, rewrite, history];
        }
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
        get history() {
            return this._history;
        }
        set history(newVal) {
            this._history = newVal;
            this.onInputPropsChange();
        }
        onInputPropsChange() {
            if (!this._make && !this._rewrite)
                return;
            if (!this.history)
                return;
            let newState;
            switch (typeof this.history) {
                case 'object':
                    newState = window.history.state ? Object.assign({}, window.history.state) : {};
                    Object.assign(newState, this.history);
                    break;
                case 'string':
                case 'number':
                    newState = this.history;
                    break;
            }
            if (this.make) {
                window.history.pushState(newState, '');
            }
            else if (this.rewrite) {
                window.history.replaceState(newState, '');
            }
        }
        static get observedAttributes() {
            const p = XtalState.properties;
            return [p[0], p[1]];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case make:
                    this._make = newValue !== null;
                    break;
                case rewrite:
                    this._rewrite = newValue !== null;
                    break;
            }
            this.onInputPropsChange();
        }
        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
        connectedCallback() {
            XtalState.properties.forEach(prop => this._upgradeProperty(prop));
        }
    }
    customElements.define(tagName, XtalState);
})();
//# sourceMappingURL=xtal-state.js.map