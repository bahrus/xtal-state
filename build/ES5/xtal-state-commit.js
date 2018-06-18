import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";var make="make",rewrite="rewrite",history="history",title="title",url="url";export var XtalStateCommit=function(_XtallatX){babelHelpers.inherits(XtalStateCommit,_XtallatX);function XtalStateCommit(){babelHelpers.classCallCheck(this,XtalStateCommit);return babelHelpers.possibleConstructorReturn(this,(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit)).apply(this,arguments))}babelHelpers.createClass(XtalStateCommit,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"attributeChangedCallback",this).call(this,name,oldValue,newValue);switch(name){case rewrite:case make:this["_"+name]=null!==newValue;break;case url:case title:this["_"+name]=newValue;break;}this.onPropsChange()}},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"connectedCallback",this).call(this);this._upgradeProperties(XtalStateCommit.observedAttributes.concat([history]));this._connected=!1;this.onPropsChange()}},{key:"onPropsChange",value:function onPropsChange(){if(this._disabled||!this._connected||!this._make&&!this._rewrite||this._history)return;this.updateHistory({proposedState:this._history,url:this._url,title:this._title})}},{key:"updateHistory",value:function updateHistory(detail){var method=this.make?"push":"replace";history[method+"State"](detail.proposedState,detail.title?detail.title:"",detail.url)}},{key:"make",get:function get(){return this._make},set:function set(newVal){if(null!==newVal){this.setAttribute(make,"")}else{this.removeAttribute(make)}}},{key:"rewrite",get:function get(){return this._rewrite},set:function set(newVal){if(newVal){this.setAttribute(rewrite,"")}else{this.removeAttribute(rewrite)}}},{key:"history",get:function get(){return this._history},set:function set(newVal){this._history=newVal;this.onPropsChange()}},{key:"title",get:function get(){return this._title},set:function set(val){this.setAttribute(title,val)}},{key:"url",get:function get(){return this._url},set:function set(val){this.setAttribute(url,val)}}],[{key:"is",get:function get(){return"xtal-state-commit"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit),"observedAttributes",this).concat([make,rewrite,title,url])}}]);return XtalStateCommit}(XtallatX(HTMLElement));if(!customElements.get(XtalStateCommit.is))customElements.define(XtalStateCommit.is,XtalStateCommit);