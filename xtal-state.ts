export interface IXtalStateProperties {
    historyState: any;
    setStateAndPush: boolean;
    setStateAndReplace: boolean;
    source: any;
}

(function () {
    const setStateAndPush = 'set-state-and-push';
    const setStateAndReplace = 'set-state-and-replace';
    const historyStateChanged = 'history-state-changed';
    //const waitToSubscribe = 'wait-to-subscribe';
    const xtalState = 'xtal-state';
    const subscribers: XtalState[] = [];
    const originalPushState = history.pushState;
    const boundPushState = originalPushState.bind(history);
    history.pushState = function (newState: any, title: string, URL: string) {
        boundPushState(newState, title, URL);
        subscribers.forEach(subscriber => {
            subscriber.historyState = newState;
        })
    }
    const originalReplaceState = history.replaceState;
    const boundReplaceState = originalReplaceState.bind(history);
    history.replaceState = function (newState: any, title: string, URL: string) {
        boundReplaceState(newState, title, URL);
        subscribers.forEach(subscriber => {
            subscriber.historyState = newState;
        })
    }
    window.addEventListener('popstate', e => {
        subscribers.forEach(subscriber => {
            subscriber.historyState = history.state;
        })
    }); //should I be concerned?:  https://jsperf.com/onpopstate-vs-addeventlistener
    this.addEventListener(historyStateChanged, this.updateState);
    /**
     * `xtal-state`
     *  Web component wrapper around the history api 
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalState extends HTMLElement implements IXtalStateProperties {
        //_state: any;
        //_counter = 0;

        get historyState() {
            return window.history.state;
        }
        set historyState(newVal) {
            this.notifyHistoryChange(newVal);
        }
        notifyHistoryChange(newVal: any) {
            const newEvent = new CustomEvent(historyStateChanged, {
                detail: {
                    value: newVal,
                },
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
        }
        _push: boolean;
        get setStateAndPush() {
            return this._push;
        }
        set setStateAndPush(newVal) {
            if (newVal) {
                this.setAttribute(setStateAndPush, '');
            } else {
                this.removeAttribute(setStateAndPush);
            }
        }
        _replace: boolean;
        get setStateAndReplace() {
            return this._replace;
        }
        set setStateAndReplace(newVal) {
            if (newVal) {
                this.setAttribute(setStateAndReplace, '');
            } else {
                this.removeAttribute(setStateAndReplace);
            }
        }

        _source: any;
        get source() {
            return this._source;
        }
        set source(newVal) {
            this._source = newVal;
            this.onInputPropsChange();
        }
        onInputPropsChange() {
            if (!this._push && !this._replace) return;
            if (!this.source) return;
            let newState;
            switch (typeof this.source) {
                case 'object':
                    newState = window.history.state ? Object.assign({}, window.history.state) : {};
                    Object.assign(newState, this.source);
                    break;
                case 'string':
                case 'number':
                    newState = this.source;
                    break;

            }

            if (this._push) {
                //window.history.pushState(newState, 'p' + this._counter, 'p' + this._counter);
                window.history.pushState(newState, '');
            } else {
                //window.history.replaceState(newState, 'r' + this._counter, 'r' + this._counter);
                window.history.replaceState(newState, '');
            }
            //this._counter++;
            //this.historyState = newState;
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
            this._upgradeProperty('setStateAndPush');
            this._upgradeProperty('setStateAndReplace');
            this._upgradeProperty('source');
            // const _this = this;
            // //window.addEventListener('popstate', this.updateState);
            // //const handler = this.broadastHistoryChange
            // window.addEventListener('popstate', e =>{
            //     // //debugger;
            //     // this.updateState(e, _this);
            //    // _this.historyState = window.history.state; 
            //    //console.log('popstate');
            //    _this.broadcastHistoryChange(_this.historyState, true);
            // }); //should I be concerned?:  https://jsperf.com/onpopstate-vs-addeventlistener
            // this.addEventListener(historyStateChanged, this.updateState);
            this.historyState = window.history.state;
            subscribers.push(this);
        }
        // disconnectedCallback(){
        //     window.removeEventListener('popstate', this.updateState);
        // }
        // updateState(e){
        //     if(e.type === historyStateChanged && this === e.target) return;
        //     if(e.detail && e.detail.fromPopEvent) return;
        //     //this.historyState = Object.assign({}, window.history.state) ;
        //     this.historyState = window.history.state;
        // }
    }
    customElements.define(xtalState, XtalState);
})();