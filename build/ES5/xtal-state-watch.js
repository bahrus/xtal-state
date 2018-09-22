import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";var wherePath1="where-path",watch="watch",subscribers=[];export var XtalStateWatch=function(_XtallatX){babelHelpers.inherits(XtalStateWatch,_XtallatX);babelHelpers.createClass(XtalStateWatch,null,[{key:"is",get:function get(){return"xtal-state-watch"}}]);function XtalStateWatch(){var _this;babelHelpers.classCallCheck(this,XtalStateWatch);_this=babelHelpers.possibleConstructorReturn(this,(XtalStateWatch.__proto__||Object.getPrototypeOf(XtalStateWatch)).call(this));subscribers.push(babelHelpers.assertThisInitialized(_this));return _this}babelHelpers.createClass(XtalStateWatch,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){babelHelpers.get(XtalStateWatch.prototype.__proto__||Object.getPrototypeOf(XtalStateWatch.prototype),"attributeChangedCallback",this).call(this,name,oldValue,newValue);switch(name){case watch:this._watch=null!==newValue;break;case wherePath1:this._wherePath=newValue;break;}this.notify()}},{key:"connectedCallback",value:function connectedCallback(){this._connected=!0;this.notify()}},{key:"filter",value:function filter(){if(!this._wherePath)return window.history.state;var obj=window.history.state,paths=this._wherePath.split("."),idx=0,len=paths.length;while(obj&&idx<len){obj=obj[paths[idx++]]}return obj}},{key:"notify",value:function notify(){var _this2=this;if(!this._watch||this._disabled||!this._connected)return;var newVal=this.filter(),historyNotificationPacket={rawHistoryObject:newVal,detailedHistoryObject:null,wherePath:this._wherePath,customInjector:null,isInvalid:!1},dataInjectionEvent={value:historyNotificationPacket};this.de("raw-history",dataInjectionEvent);var returnDetail=dataInjectionEvent.value;if(returnDetail.isInvalid)return;if(returnDetail.customInjector){var result=returnDetail.customInjector(historyNotificationPacket);if("function"===typeof result.then){result.then(function(){_this2.de("derived-history",{value:returnDetail.detailedHistoryObject||returnDetail.rawHistoryObject})});return}}this.de("derived-history",{value:returnDetail.detailedHistoryObject||returnDetail.rawHistoryObject})}},{key:"derivedHistory",get:function get(){return this.filter()}},{key:"history",get:function get(){return this._history},set:function set(newVal){this._history=newVal;if(this.watch)this.notify()}},{key:"watch",get:function get(){return this._watch},set:function set(newVal){if(newVal){this.setAttribute(watch,"")}else{this.removeAttribute(watch)}}},{key:"wherePath",get:function get(){return this._wherePath},set:function set(val){this.setAttribute(wherePath1,val)}}],[{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateWatch.__proto__||Object.getPrototypeOf(XtalStateWatch),"observedAttributes",this).concat([watch,wherePath1])}}]);return XtalStateWatch}(XtallatX(HTMLElement));if(!customElements.get(XtalStateWatch.is))customElements.define(XtalStateWatch.is,XtalStateWatch);var originalPushState=history.pushState,boundPushState=originalPushState.bind(history);history.pushState=function(newState,title,URL){boundPushState(newState,title,URL);subscribers.forEach(function(subscriber){subscriber.history=newState})};var originalReplaceState=history.replaceState,boundReplaceState=originalReplaceState.bind(history);history.replaceState=function(newState,title,URL){boundReplaceState(newState,title,URL);subscribers.forEach(function(subscriber){subscriber.history=newState})};window.addEventListener("popstate",function(){subscribers.forEach(function(subscriber){subscriber.history=history.state})});