export interface IXtalStateWatchProperties {
    history: any;
    watch: any;
}
(function () {
    const tagName = 'xtal-state-watch';
    if(customElements.get(tagName)) return;
    const historyChanged = 'history-changed';
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
        get history() {
            return window.history.state;
        }
        set history(newVal) {
            if(this.watch) this.notify(newVal);
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
        notify(newVal?: any){
            if(!newVal) newVal = history.state;

            const newEvent = new CustomEvent(historyChanged, {
                detail: {
                    value: window.history.state,
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
            return [watch];
        }
        attributeChangedCallback(name, oldValue, newValue) {

            switch (name) {
                case watch:
                    this._watch = newValue !== null;
                    if(this._watch) this.notify();
                    break;
            }
        }

        connectedCallback() {
            this._upgradeProperty('watch');
            subscribers.push(this);
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