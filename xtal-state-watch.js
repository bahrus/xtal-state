(function () {
    const tagName = 'xtal-state-watch';
    if (customElements.get(tagName))
        return;
    const historyChanged = 'history-changed';
    const wherePath = 'where-path';
    const watch = 'watch';
    const subscribers = [];
    const originalPushState = history.pushState;
    const boundPushState = originalPushState.bind(history);
    history.pushState = function (newState, title, URL) {
        boundPushState(newState, title, URL);
        subscribers.forEach(subscriber => {
            subscriber.history = newState;
        });
    };
    const originalReplaceState = history.replaceState;
    const boundReplaceState = originalReplaceState.bind(history);
    history.replaceState = function (newState, title, URL) {
        boundReplaceState(newState, title, URL);
        subscribers.forEach(subscriber => {
            subscriber.history = newState;
        });
    };
    window.addEventListener('popstate', e => {
        subscribers.forEach(subscriber => {
            subscriber.history = history.state;
        });
    });
    class XtalStateWatch extends HTMLElement {
        get history() {
            return this.filter();
        }
        set history(newVal) {
            if (this.watch)
                this.notify();
        }
        get watch() { return this._watch; }
        set watch(newVal) {
            if (newVal) {
                this.setAttribute(watch, '');
            }
            else {
                this.removeAttribute(watch);
            }
        }
        get wherePath() { return this._wherePath; }
        set wherePath(val) {
            this.setAttribute(wherePath, val);
        }
        filter() {
            if (!this._wherePath)
                return window.history.state;
            let obj = window.history.state;
            const paths = this._wherePath.split('.');
            let idx = 0;
            while (obj) {
                obj = obj[paths[idx++]];
            }
            return obj;
        }
        notify() {
            if (!this._watch)
                return;
            const newVal = this.filter();
            const newEvent = new CustomEvent(historyChanged, {
                detail: {
                    value: newVal,
                },
                bubbles: true,
                composed: false,
            });
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
            subscribers.push(this);
        }
        disconnectedCallback() {
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
    customElements.define(tagName, XtalStateWatch);
})();
//# sourceMappingURL=xtal-state-watch.js.map