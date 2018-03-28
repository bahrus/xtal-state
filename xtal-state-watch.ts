export interface IXtalStateWatchProperties {
    history: any;
    watch: any;
    wherePath: string;
}
(function () {
    const tagName = 'xtal-state-watch';
    if(customElements.get(tagName)) return;
    const historyChanged = 'history-changed';
    const wherePath = 'where-path';
    const watch = 'watch';
    const subscribers: XtalStateWatch[] = [];
    const originalPushState = history.pushState;
    const boundPushState = originalPushState.bind(history);
    history.pushState = function (newState: any, title: string, URL: string) {
        boundPushState(newState, title, URL);
        subscribers.forEach(subscriber => {
            subscriber.history = newState;
        })
    }
    const originalReplaceState = history.replaceState;
    const boundReplaceState = originalReplaceState.bind(history);
    history.replaceState = function (newState: any, title: string, URL: string) {
        boundReplaceState(newState, title, URL);
        subscribers.forEach(subscriber => {
            subscriber.history = newState;
        })
    }
    window.addEventListener('popstate', e => {
        subscribers.forEach(subscriber => {
            subscriber.history = history.state;
        })
    });
    class XtalStateWatch extends HTMLElement implements IXtalStateWatchProperties{
        constructor(){
            super();
            subscribers.push(this);
        }
        
        get history() {
            return this.filter();
        }
        set history(newVal) {
            if(this.watch) this.notify();
        }
        _watch: boolean;
        get watch(){return this._watch;}
        set watch(newVal){
            if(newVal) {
                this.setAttribute(watch, '');
            }else{
                this.removeAttribute(watch);
            }
        }
        _wherePath: string;
        get wherePath(){return this._wherePath;}
        set wherePath(val){
            this.setAttribute(wherePath, val);
        }

        filter(){
            if(!this._wherePath) return window.history.state;
            let obj = window.history.state;
            const paths = this._wherePath.split('.');
            let idx = 0;
            const len = paths.length;
            while(obj && idx < len){
                obj = obj[paths[idx++]];
            }
            return obj;
        }
        
        notify(){
            if(!this._watch) return;
            const newVal = this.filter();
            const newEvent = new CustomEvent(historyChanged, {
                detail: {
                    value: newVal,
                },
                bubbles: true,
                composed: false,
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
        }

        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
        static get observedAttributes() {
            return [watch, wherePath];
        }
        attributeChangedCallback(name, oldValue, newValue) {

            switch (name) {
                case watch:
                    this._watch = newValue !== null;
                    this.notify();
                    break;
                case wherePath:
                    this._wherePath = newValue;
                    this.notify();
                    break;
            }
        }

        connectedCallback() {
            this._upgradeProperty('watch');
        }
        disconnectedCallback(){
            this.delete(subscribers, this);
        }
        delete(array, element) {
            //https://blog.mariusschulz.com/2016/07/16/removing-elements-from-javascript-arrays
            const index = array.indexOf(element);
            if (index !== -1) {
                array.splice(index, 1);
            }
        }
    }
    customElements.define(tagName, XtalStateWatch)
})();