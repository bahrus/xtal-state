export interface IXtalStateUpdateProperties {
    make: boolean;
    rewrite: boolean;
    history: any;
    wherePath: string;
}

(function () {
    const tagName = 'xtal-state-update';
    if (customElements.get(tagName)) return;
    const make = 'make';
    const rewrite = 'rewrite';
    const history = 'history';
    const wherePath = 'where-path';
    /**
     * `xtal-state-update`
     *  Web component wrapper around the history push/replace api 
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalStateUpdate extends HTMLElement implements IXtalStateUpdateProperties {
        static get properties() {
            return [make, rewrite, history]
        }
        _make: boolean;
        get make() {
            return this._make;
        }
        set make(newVal) {
            if (newVal !== null) {
                this.setAttribute(make, '');
            } else {
                this.removeAttribute(make);
            }
        }
        _rewrite: boolean;
        get rewrite() {
            return this._rewrite;
        }
        set rewrite(newVal) {
            if (newVal) {
                this.setAttribute(rewrite, '');
            } else {
                this.removeAttribute(rewrite);
            }
        }

        _history: any;
        get history() {
            return this._history;
        }
        set history(newVal) {
            this._history = newVal;
            this.onInputPropsChange();
        }

        get nsHistory(){
            if(!this._wherePath || !this._history) return this._history;
            const returnObj = {};
            let currPath = returnObj;
            this._wherePath.split('.').forEach(path =>{
                currPath[path] = {};
                currPath = currPath[path];
            })
            Object.assign(currPath, this._history);
            return returnObj;
        }
        _wherePath: string;
        get wherePath(){return this._wherePath;}
        set wherePath(val){
            this.setAttribute(wherePath, val);
        }
        static _lastPath: string;
        onInputPropsChange() {
            if (!this._make && !this._rewrite) return;
            if (!this.history) return;
            let newState;
            let history = this.nsHistory;
            switch (typeof history) {
                case 'object':
                    newState = window.history.state ? Object.assign({}, window.history.state) : {};
                    this.mergeDeep(newState, history);
                    break;
                case 'string':
                case 'number':
                    newState = history;
                    break;

            }
            XtalStateUpdate._lastPath = this._wherePath;
            if (this.make) {
                window.history.pushState(newState, '');
            } else if (this.rewrite) {
                window.history.replaceState(newState, '');
            }
        }
        static get observedAttributes() {
            const p = XtalStateUpdate.properties;
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
            XtalStateUpdate.properties.forEach(prop => this._upgradeProperty(prop));
        }

        /**
         * Deep merge two objects.
         * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
         * @param target
         * @param source
         * 
        */
        mergeDeep(target, source) {
            if (typeof target !== 'object') return;
            if (typeof source !== 'object') return;
            for (const key in source) {
                const sourceVal = source[key];
                const targetVal = target[key];
                if (!sourceVal) continue; //TODO:  null out property?
                if (!targetVal) {
                    target[key] = sourceVal;
                    continue;
                }
                if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
                    //warning!! code below not yet tested
                    if (targetVal.length > 0 && typeof targetVal[0].id === 'undefined') continue;
                    for (var i = 0, ii = sourceVal.length; i < ii; i++) {
                        const srcEl = sourceVal[i];
                        if (typeof srcEl.id === 'undefined') continue;
                        const targetEl = targetVal.find(function (el) { return el.id === srcEl.id; });
                        if (targetEl) {
                            this.mergeDeep(targetEl, srcEl);
                        } else {
                            targetVal.push(srcEl);
                        }
                    }
                    continue;
                }
                switch (typeof sourceVal) {
                    case 'object':
                        switch (typeof targetVal) {
                            case 'object':
                                this.mergeDeep(targetVal, sourceVal);
                                break;
                            default:
                                console.log(key);
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
    }
    customElements.define(tagName, XtalStateUpdate);
})();