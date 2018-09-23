import {XtalStateBase} from './xtal-state-base.js';
import {define} from 'xtal-latx/define.js';
const watch = 'watch';
const xtal_subscribers = 'xtal-subscribers';

export class XtalStateWatch extends XtalStateBase {
    static get is(){return 'xtal-state-watch';}
    constructor(){
        super();
    }
    static get observedAttributes() {
        return super.observedAttributes.concat( [watch]);
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case watch:
                this._watch = newValue !== null;
                break;
        }
        this.notify();
    }
    _connected!: boolean;
    addSubscribers(){
        if(this._notReady){
            setTimeout(() =>{
                this.addSubscribers();
            }, 50);
            return;
        }
        const win = this._window;
        if(!win[xtal_subscribers]){
            win[xtal_subscribers] = [];
            const originalPushState = win.history.pushState;
            const boundPushState = originalPushState.bind(win.history);
            win.history.pushState = function (newState: any, title: string, URL: string) {
                boundPushState(newState, title, URL);
                win[xtal_subscribers].forEach(subscriber => {
                    subscriber.history = newState;
                })
            }
            const originalReplaceState = win.history.replaceState;
            const boundReplaceState = originalReplaceState.bind(win.history); 
            win.history.replaceState = function (newState: any, title: string, URL: string) { 
                boundReplaceState(newState, title, URL);
                win[xtal_subscribers].forEach(subscriber => {
                    subscriber.history = newState;
                })
            }
            win.addEventListener('popstate', e => {
                win[xtal_subscribers].forEach(subscriber => {
                    subscriber.history = history.state;
                })
            });
        }
        this._window[xtal_subscribers].push(this);
        this._connected = true;
        this.notify();
    }
    connectedCallback(){
        //this._connected = true;
        super.connectedCallback();
        this.addSubscribers();
    }
    _history!: any;
    get history(){
        return this._history;
    }
    set history(newVal) {
        this._history = newVal;
        if(this._watch) this.notify();
    }
    _watch!: boolean;
    get watch(){return this._watch;}
    set watch(newVal){
        this.attr(watch, newVal, '');
    }
    

    notify(){
        if(!this._watch || this._disabled || !this._connected) return;
        this.de('history', {
            value:this._window.history.state
        });
    }
}
define(XtalStateWatch);
//if(!customElements.get(XtalStateWatch.is)) customElements.define(XtalStateWatch.is, XtalStateWatch);

