(function(){var disabled="disabled";function XtallatX(superClass){return function(_superClass){babelHelpers.inherits(_class,_superClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}},{key:"de",value:function de(name,detail){var newEvent=new CustomEvent(name+"-changed",{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);return newEvent}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this=this;props.forEach(function(prop){if(_this.hasOwnProperty(prop)){var value=_this[prop];delete _this[prop];_this[prop]=value}})}},{key:"disabled",get:function get(){return this._disabled},set:function set(val){if(val){this.setAttribute(disabled,"")}else{this.removeAttribute(disabled)}}}],[{key:"observedAttributes",get:function get(){return[disabled]}}]);return _class}(superClass)}var make="make",rewrite="rewrite",history="history",title="title",url="url",XtalStateCommit=function(_XtallatX){babelHelpers.inherits(XtalStateCommit,_XtallatX);function XtalStateCommit(){babelHelpers.classCallCheck(this,XtalStateCommit);return babelHelpers.possibleConstructorReturn(this,(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit)).apply(this,arguments))}babelHelpers.createClass(XtalStateCommit,[{key:"namespaceHistory",value:function namespaceHistory(history){return history}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"attributeChangedCallback",this).call(this,name,oldValue,newValue);switch(name){case rewrite:case make:this["_"+name]=null!==newValue;break;case url:case title:this["_"+name]=newValue;break;}this.onPropsChange()}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(XtalStateCommit.observedAttributes.concat([history]));this._connected=!0;this.onPropsChange()}},{key:"preProcess",value:function preProcess(){}},{key:"onPropsChange",value:function onPropsChange(){if(this._disabled||!this._connected||!this._make&&!this._rewrite||!this._namespacedHistoryUpdate)return;var stateUpdate={proposedState:this._namespacedHistoryUpdate,url:this._url,title:this._title};this.preProcess(stateUpdate);if(!stateUpdate.completed)this.updateHistory(stateUpdate)}},{key:"updateHistory",value:function updateHistory(detail){var method=this.make?"push":"replace";window.history[method+"State"](detail.proposedState,detail.title?detail.title:"",detail.url)}},{key:"make",get:function get(){return this._make},set:function set(newVal){if(null!==newVal){this.setAttribute(make,"")}else{this.removeAttribute(make)}}},{key:"rewrite",get:function get(){return this._rewrite},set:function set(newVal){if(newVal){this.setAttribute(rewrite,"")}else{this.removeAttribute(rewrite)}}},{key:"history",set:function set(newVal){this._namespacedHistoryUpdate=this.namespaceHistory(newVal);this.onPropsChange()}},{key:"title",get:function get(){return this._title},set:function set(val){this.setAttribute(title,val)}},{key:"url",get:function get(){return this._url},set:function set(val){this.setAttribute(url,val)}}],[{key:"is",get:function get(){return"xtal-state-commit"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit),"observedAttributes",this).concat([make,rewrite,title,url])}}]);return XtalStateCommit}(XtallatX(HTMLElement));if(!customElements.get(XtalStateCommit.is))customElements.define(XtalStateCommit.is,XtalStateCommit);var wherePath2="where-path";var XtalStateUpdate=function(_XtalStateCommit){babelHelpers.inherits(XtalStateUpdate,_XtalStateCommit);function XtalStateUpdate(){babelHelpers.classCallCheck(this,XtalStateUpdate);return babelHelpers.possibleConstructorReturn(this,(XtalStateUpdate.__proto__||Object.getPrototypeOf(XtalStateUpdate)).apply(this,arguments))}babelHelpers.createClass(XtalStateUpdate,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case wherePath2:this._wherePath=newVal;break;}babelHelpers.get(XtalStateUpdate.prototype.__proto__||Object.getPrototypeOf(XtalStateUpdate.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);this.onPropsChange()}},{key:"namespaceHistory",value:function namespaceHistory(history){var _this2=this;if(!this._wherePath)return history;var returnObj={},currPath=returnObj,tokens=this._wherePath.split("."),len=tokens.length-1,count=0;tokens.forEach(function(path){currPath[path]=count===len?_this2._namespacedHistoryUpdate:{};currPath=currPath[path];count++});return returnObj}},{key:"mergeDeep",value:function mergeDeep(target,source){if("object"!==babelHelpers.typeof(target))return;if("object"!==babelHelpers.typeof(source))return;for(var key in source){var sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}switch(babelHelpers.typeof(sourceVal)){case"object":switch(babelHelpers.typeof(targetVal)){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}},{key:"preProcess",value:function preProcess(stateUpdate){var _this3=this;stateUpdate.wherePath=this._wherePath;XtalStateUpdate._lastPath=this._wherePath;this.de("pre-history-merge",{value:stateUpdate});if(!stateUpdate.completed){if(stateUpdate.customUpdater){stateUpdate.completed=!0;var update=stateUpdate.customUpdater(stateUpdate);if(update.proposedState.then&&babelHelpers.typeof("function"===update.proposedState.then)){update.then(function(newDetail){_this3.updateHistory(newDetail)})}}else{var newState=window.history.state?Object.assign({},window.history.state):{};this.mergeDeep(newState,this._namespacedHistoryUpdate)}}}},{key:"wherePath",get:function get(){return this._wherePath},set:function set(val){this.setAttribute(wherePath2,val)}}],[{key:"is",get:function get(){return"xtal-state-update"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateUpdate.__proto__||Object.getPrototypeOf(XtalStateUpdate),"observedAttributes",this).concat([wherePath2])}}]);return XtalStateUpdate}(XtalStateCommit);if(!customElements.get(XtalStateUpdate.is)){customElements.define(XtalStateUpdate.is,XtalStateUpdate)}var wherePath1="where-path",watch="watch",subscribers=[],XtalStateWatch=function(_XtallatX2){babelHelpers.inherits(XtalStateWatch,_XtallatX2);babelHelpers.createClass(XtalStateWatch,null,[{key:"is",get:function get(){return"xtal-state-watch"}}]);function XtalStateWatch(){var _this4;babelHelpers.classCallCheck(this,XtalStateWatch);_this4=babelHelpers.possibleConstructorReturn(this,(XtalStateWatch.__proto__||Object.getPrototypeOf(XtalStateWatch)).call(this));subscribers.push(babelHelpers.assertThisInitialized(_this4));return _this4}babelHelpers.createClass(XtalStateWatch,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){babelHelpers.get(XtalStateWatch.prototype.__proto__||Object.getPrototypeOf(XtalStateWatch.prototype),"attributeChangedCallback",this).call(this,name,oldValue,newValue);switch(name){case watch:this._watch=null!==newValue;break;case wherePath1:this._wherePath=newValue;break;}this.notify()}},{key:"connectedCallback",value:function connectedCallback(){this._connected=!0;this.notify()}},{key:"filter",value:function filter(){if(!this._wherePath)return window.history.state;var obj=window.history.state,paths=this._wherePath.split("."),idx=0,len=paths.length;while(obj&&idx<len){obj=obj[paths[idx++]]}return obj}},{key:"notify",value:function notify(){var _this5=this;if(!this._watch||this._disabled||!this._connected)return;var newVal=this.filter(),historyNotificationPacket={rawHistoryObject:newVal,detailedHistoryObject:null,wherePath:this._wherePath,customInjector:null,isInvalid:!1},dataInjectionEvent={value:historyNotificationPacket};this.de("raw-history",dataInjectionEvent);var returnDetail=dataInjectionEvent.value;if(returnDetail.isInvalid)return;if(returnDetail.customInjector){var result=returnDetail.customInjector(historyNotificationPacket);if("function"===typeof result.then){result.then(function(){_this5.de("filtered-history",{value:returnDetail.detailedHistoryObject||returnDetail.rawHistoryObject})});return}}this.de("filtered-history",{value:returnDetail.detailedHistoryObject||returnDetail.rawHistoryObject})}},{key:"filteredHistory",get:function get(){return this.filter()}},{key:"history",set:function set(){if(this.watch)this.notify()}},{key:"watch",get:function get(){return this._watch},set:function set(newVal){if(newVal){this.setAttribute(watch,"")}else{this.removeAttribute(watch)}}},{key:"wherePath",get:function get(){return this._wherePath},set:function set(val){this.setAttribute(wherePath1,val)}}],[{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateWatch.__proto__||Object.getPrototypeOf(XtalStateWatch),"observedAttributes",this).concat([watch,wherePath1])}}]);return XtalStateWatch}(XtallatX(HTMLElement));if(!customElements.get(XtalStateWatch.is))customElements.define(XtalStateWatch.is,XtalStateWatch);var originalPushState=history.pushState,boundPushState=originalPushState.bind(history);history.pushState=function(newState,title,URL){boundPushState(newState,title,URL);subscribers.forEach(function(subscriber){subscriber.history=newState})};var originalReplaceState=history.replaceState,boundReplaceState=originalReplaceState.bind(history);history.replaceState=function(newState,title,URL){boundReplaceState(newState,title,URL);subscribers.forEach(function(subscriber){subscriber.history=newState})};window.addEventListener("popstate",function(){subscribers.forEach(function(subscriber){subscriber.history=history.state})})})();