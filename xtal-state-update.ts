export interface IXtalStateUpdateProperties {
    make: boolean;
    rewrite: boolean;
    history: any;
    wherePath: string;
}

export interface IHistoryUpdatePacket {
    proposedState: any,
    title: string,
    url: string,
    completed: boolean,
    wherePath: string,
    customUpdater: any,
}

(function () {
    const tagName = 'xtal-state-update';
    if (customElements.get(tagName)) return;
    const make = 'make';
    const rewrite = 'rewrite';
    const history = 'history';
    const wherePath = 'where-path';
    const bubbles = 'bubbles';
    const composed = 'composed';
    const dispatch = 'dispatch';
    const title = 'title';
    const url = 'url';
    const event_name = 'event-name';
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
            return [make, rewrite, 'wherePath', history, bubbles, composed, dispatch, 'eventName', url, title];
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

        _bubbles: boolean;
        get bubbles() {
            return this._bubbles;
        }
        set bubbles(val) {
            if (val) {
                this.setAttribute(bubbles, '');
            } else {
                this.removeAttribute(bubbles);
            }
        }
        _composed: boolean;
        get composed() {
            return this._composed;
        }
        set composed(val) {
            if (val) {
                this.setAttribute(composed, '');
            } else {
                this.removeAttribute(composed);
            }
        }
        _dispatch: boolean;
        get dispatch() {
            return this._dispatch;
        }
        set dispatch(val){
            if(val){
                this.setAttribute(dispatch, '');
            }else{
                this.removeAttribute(dispatch);
            }
        }

        get eventName() {
            return this.getAttribute(event_name);
        }
        set eventName(val: string) {
            this.setAttribute(event_name, val);
        }

        _history: any;
        get history() {
            return this._history;
        }
        set history(newVal) {
            this._history = newVal;
            this.onInputPropsChange();
        }

        get title() {
            return this.getAttribute(title);
        }
        set title(val) {
            this.setAttribute(title, val);
        }

        get url() {
            return this.getAttribute(url);
        }

        set url(val) {
            this.setAttribute(url, val);
        }

        get nsHistory() {
            if (!this._wherePath || !this._history) return this._history;
            const returnObj = {};
            let currPath = returnObj;
            const tokens = this._wherePath.split('.');
            const len = tokens.length - 1;
            let count = 0;
            tokens.forEach(path => {
                currPath[path] = count === len ? this._history : {};
                currPath = currPath[path];
                count++;
            });
            //debugger;
            //Object.assign(currPath, this._history);
            //this.applyObject(currPath, this._history);
            return returnObj;
        }
        // applyObject(target: any, source: any){
        //     switch (typeof source) {
        //         case 'object':
        //             this.mergeDeep(target, history);
        //             break;
        //         case 'string':
        //         case 'number':
        //             target = history;
        //             break;

        //     }
        //     return target;
        // }
        _wherePath: string;
        get wherePath() { return this._wherePath; }
        set wherePath(val) {
            this.setAttribute(wherePath, val);
        }
        static _lastPath: string;
        onInputPropsChange() {
            if (!this._make && !this._rewrite) return;
            if (!this.history) return;
            let newState = window.history.state ? Object.assign({}, window.history.state) : {};
            let history = this.nsHistory;
            //newState = this.applyObject(newState, history);
            XtalStateUpdate._lastPath = this._wherePath;
            const detail = {
                proposedState: newState,
                title: this.title,
                url: this.url,
                completed: false,
                wherePath: this._wherePath,
                customUpdater: null
            } as IHistoryUpdatePacket;
            const newEvent = new CustomEvent(this.eventName, {
                bubbles: this._bubbles,
                composed: this._composed,
                detail: detail
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
            if (detail.completed) return;
                        //let titleIsReady = true;
            //let urlIsReady = true;
            //let detailIsReady = true;
            if (detail.customUpdater) {
                const update = detail.customUpdater(detail);
                if (update.proposedState['then'] && typeof (update.proposedState['then'] === 'function')) {
                    update['then'](newDetail => {
                        this.updateHistory(newDetail);
                    })
                    return;
                }
            }
            switch (typeof history) {
                case 'object':
                    this.mergeDeep(newState, history);
                    break;
                case 'string':
                case 'number':
                    newState = history;
                    break;

            }



            this.updateHistory(detail);

        }

        updateHistory(detail: IHistoryUpdatePacket) {
            // if(typeof detail.url === 'function'){
            //     detail.url(detail);
            //     return;
            // }
            if (this.make) {
                window.history.pushState(detail.proposedState, detail.title ? detail.title : '', detail.url);
            } else if (this.rewrite) {
                window.history.replaceState(detail.proposedState, detail.title ? detail.title : '', detail.url);
            }
        }

        static get observedAttributes() {
            //const p = XtalStateUpdate.properties;
            return [make, rewrite, wherePath, dispatch, composed, bubbles];
        }
        attributeChangedCallback(name, oldValue, newValue) {

            switch (name) {

                case make:
                    this._make = newValue !== null;
                    break;

                case rewrite:
                    this._rewrite = newValue !== null;
                    break;
                case wherePath:
                    this._wherePath = newValue;
                    break;
                case dispatch:
                    this._dispatch = newValue !== null;
                    break;
                case composed:
                    this._composed = newValue !== null;
                    break;
                case bubbles:
                    this._bubbles = newValue !== null;
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
                // if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
                //     //warning!! code below not yet tested
                //     if (targetVal.length > 0 && typeof targetVal[0].id === 'undefined') continue;
                //     for (var i = 0, ii = sourceVal.length; i < ii; i++) {
                //         const srcEl = sourceVal[i];
                //         if (typeof srcEl.id === 'undefined') continue;
                //         const targetEl = targetVal.find(function (el) { return el.id === srcEl.id; });
                //         if (targetEl) {
                //             this.mergeDeep(targetEl, srcEl);
                //         } else {
                //             targetVal.push(srcEl);
                //         }
                //     }
                //     continue;
                // }
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
    }
    customElements.define(tagName, XtalStateUpdate);
})();