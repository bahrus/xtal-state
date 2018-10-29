import{XtalStateBase}from"./xtal-state-base.js";import{define}from"./node_modules/xtal-latx/define.js";const watch="watch",xtal_subscribers="xtal-subscribers",popstate="popstate";function remove(array,element){const index=array.indexOf(element);if(-1!==index){array.splice(index,1)}}export class XtalStateWatch extends XtalStateBase{static get is(){return"xtal-state-watch"}constructor(){super()}static get observedAttributes(){return super.observedAttributes.concat([watch])}attributeChangedCallback(name,oldValue,nv){super.attributeChangedCallback(name,oldValue,nv);switch(name){case watch:this._watch=""===nv?"all":popstate;break;}this.notify()}addSubscribers(){if(this._notReady){setTimeout(()=>{this.addSubscribers()},50);return}const win=this._window;if(!win[xtal_subscribers]){win[xtal_subscribers]=[];const originalPushState=win.history.pushState,boundPushState=originalPushState.bind(win.history);win.history.pushState=function(newState,title,URL){boundPushState(newState,title,URL);win[xtal_subscribers].forEach(subscriber=>{delete subscriber.dataset.popstate;subscriber.history=newState})};const originalReplaceState=win.history.replaceState,boundReplaceState=originalReplaceState.bind(win.history);win.history.replaceState=function(newState,title,URL){boundReplaceState(newState,title,URL);win[xtal_subscribers].forEach(subscriber=>{delete subscriber.dataset.popstate;subscriber.history=newState})};win.addEventListener(popstate,()=>{win[xtal_subscribers].forEach(subscriber=>{subscriber.dataset.popstate="true";subscriber.history=win.history.state})})}this._window[xtal_subscribers].push(this);this._connected=!0;this.history=this._window.history.state}connectedCallback(){this._upgradeProperties([watch]);super.connectedCallback();this.addSubscribers()}disconnect(){if(this._window){const subs=this._window[xtal_subscribers];if(subs)remove(subs,this)}}disconnectedCallback(){this.disconnect()}get history(){return this._history}set history(newVal){this._history=newVal;if(this._watch)this.notify()}get watch(){return this._watch}set watch(nv){this.attr(watch,nv)}notify(){if(!this._watch||this._disabled||!this._connected||this._history===void 0||null===this._history)return;const ds=this.dataset;let doIt=!1;switch(this._watch){case"all":doIt=!0;break;case popstate:doIt=!ds.historyChanged||"true"===ds.popstate;break;}if(!doIt)return;this.de("history",{value:this._history})}}define(XtalStateWatch);