(function(){function define(custEl){var tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)}var debounce=function(fn,time){var timeout;return function(){var _this=this,_arguments=arguments;clearTimeout(timeout);timeout=setTimeout(function functionCall(){return fn.apply(_this,_arguments)},time)}},disabled="disabled";var with_path="with-path";var level="level";function getIFrmWin(par,callBack){var ifr=par.querySelector("iframe[xtal-state]");if(null===ifr){ifr=document.createElement("iframe");ifr.setAttribute("xtal-state","");ifr.addEventListener("load",function(){ifr.setAttribute("loaded","");if(null!==callBack)callBack(ifr)});ifr.src="blank.html";ifr.style.display="none";par.appendChild(ifr)}else{if(!ifr.hasAttribute("loaded")){ifr.addEventListener("load",function(){if(null!==callBack)callBack(ifr)})}else{if(null!==callBack)callBack(ifr)}}return ifr.contentWindow}function getMchPar(el,level){var test=el.parentElement;while(test){if(test.matches(level))return test;test=test.parentElement}}function getWinCtx(el,level){var _this4=this;return new Promise(function(resolve){switch(level){case"global":resolve(self);break;case"local":getIFrmWin(el.parentElement,function(ifrm){return resolve(ifrm.contentWindow)});break;case"shadow":_this4._window=getIFrmWin(getHost(_this4),function(ifrm){return resolve(ifrm.contentWindow)});break;default:_this4._window=getIFrmWin(getMchPar(el,level),function(ifrm){return resolve(ifrm.contentWindow)});}})}var XtalStateBase=function(_XtallatX){babelHelpers.inherits(XtalStateBase,_XtallatX);function XtalStateBase(){var _this5;babelHelpers.classCallCheck(this,XtalStateBase);_this5=babelHelpers.possibleConstructorReturn(this,(XtalStateBase.__proto__||Object.getPrototypeOf(XtalStateBase)).apply(this,arguments));_this5._level="global";return _this5}babelHelpers.createClass(XtalStateBase,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){babelHelpers.get(XtalStateBase.prototype.__proto__||Object.getPrototypeOf(XtalStateBase.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);switch(name){case level:this._level=newVal;break;}this.onPropsChange()}},{key:"connectedCallback",value:function connectedCallback(){this.style.display="none";this._upgradeProperties(["disabled",level]);this._conn=!0;this.onPropsChange()}},{key:"onPropsChange",value:function onPropsChange(){var _this6=this;if(!this._conn||this._disabled)return!0;if(!this._window){this._notReady=!0;getWinCtx(this,this._level).then(function(win){_this6._window=win;_this6._notReady=!1})}if(this._notReady)return!0}},{key:"level",get:function get(){return this._level},set:function set(val){this.attr(level,val)}},{key:"window",get:function get(){return this._window}}],[{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateBase.__proto__||Object.getPrototypeOf(XtalStateBase),"observedAttributes",this).concat([level])}}]);return XtalStateBase}(function(superClass){return function(_superClass){babelHelpers.inherits(_class,_superClass);function _class(){var _this2;babelHelpers.classCallCheck(this,_class);_this2=babelHelpers.possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments));_this2._evCount={};return _this2}babelHelpers.createClass(_class,[{key:"attr",value:function attr(name,val,trueVal){var v=val?"set":"remove";this[v+"Attribute"](name,trueVal||val)}},{key:"to$",value:function to$(n){var mod=n%2;return(n-mod)/2+"-"+mod}},{key:"incAttr",value:function incAttr(name){var ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr("data-"+name,this.to$(ec[name]))}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}},{key:"de",value:function de(name,detail,asIs){var eventName=name+(asIs?"":"-changed"),newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this3=this;props.forEach(function(prop){if(_this3.hasOwnProperty(prop)){var value=_this3[prop];delete _this3[prop];_this3[prop]=value}})}},{key:"disabled",get:function get(){return this._disabled},set:function set(val){this.attr(disabled,val,"")}}],[{key:"observedAttributes",get:function get(){return[disabled]}}]);return _class}(superClass)}(HTMLElement)),make="make",rewrite="rewrite",title="title",url="url",url_search="url-search",replace_url_value="replace-url-value",XtalStateCommit=function(_WithPath){babelHelpers.inherits(XtalStateCommit,_WithPath);function XtalStateCommit(){var _this7;babelHelpers.classCallCheck(this,XtalStateCommit);_this7=babelHelpers.possibleConstructorReturn(this,(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit)).apply(this,arguments));_this7._title="";return _this7}babelHelpers.createClass(XtalStateCommit,[{key:"attributeChangedCallback",value:function attributeChangedCallback(n,ov,nv){switch(n){case rewrite:case make:this["_"+n]=null!==nv;break;case url:case title:this["_"+n]=nv;break;case with_path:this._withPath=nv;break;case url_search:this._urlSearch=nv;break;case replace_url_value:this._replaceUrlValue=nv;break;}babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"attributeChangedCallback",this).call(this,n,ov,nv)}},{key:"connectedCallback",value:function connectedCallback(){var _this8=this;this._upgradeProperties([make,rewrite,title,url,"withPath","urlSearch","replaceUrlValue"].concat(["history"]));this._debouncer=debounce(function(){_this8.updateHistory()},50);babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"connectedCallback",this).call(this)}},{key:"onPropsChange",value:function onPropsChange(){var _this9=this;if(babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"onPropsChange",this).call(this)){if(this._notReady){setTimeout(function(){_this9.onPropsChange()},50);return}return!0}if(!this._make&&!this._rewrite)return!0;this._debouncer()}},{key:"mergedHistory",value:function mergedHistory(){if(this._history===void 0)return;return this.wrap(this._history)}},{key:"updateHistory",value:function updateHistory(){var hist=this.mergedHistory();if(null===hist||hist===void 0)return;if(this.make&&!this.url)return;var method=this.make?"push":"replace",url=this._url?this._url:this._window.location.href;if(this._replaceUrlValue&&this._urlSearch){var reg=new RegExp(this._urlSearch);url=url.replace(reg,this._replaceUrlValue)}this._window.history[method+"State"](hist,this._title,url);this.de("history",{value:hist})}},{key:"make",get:function get(){return this._make},set:function set(val){this.attr(make,val,"")}},{key:"rewrite",get:function get(){return this._rewrite},set:function set(val){this.attr(rewrite,val,"")}},{key:"history",get:function get(){return this._window.history.state},set:function set(newVal){this._history=newVal;this.onPropsChange()}},{key:"title",get:function get(){return this._title},set:function set(val){this.attr(title,val)}},{key:"url",get:function get(){return this._url},set:function set(val){this.attr(url,val)}},{key:"urlSearch",get:function get(){return this._urlSearch},set:function set(val){this.attr(url_search,val)}},{key:"replaceUrlValue",get:function get(){return this._replaceUrlValue},set:function set(val){this.attr(replace_url_value,val)}}],[{key:"is",get:function get(){return"xtal-state-commit"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit),"observedAttributes",this).concat([make,rewrite,title,url,with_path,url_search,replace_url_value])}}]);return XtalStateCommit}(function(superClass){return function(_superClass2){babelHelpers.inherits(_class2,_superClass2);function _class2(){babelHelpers.classCallCheck(this,_class2);return babelHelpers.possibleConstructorReturn(this,(_class2.__proto__||Object.getPrototypeOf(_class2)).apply(this,arguments))}babelHelpers.createClass(_class2,[{key:"wrap",value:function wrap(obj){if(this._withPath){var mergedObj={},retObj=mergedObj,splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach(function(pathToken,idx){if(idx===lenMinus1){mergedObj[pathToken]=obj}else{mergedObj=mergedObj[pathToken]={}}});return retObj}else{return obj}}},{key:"withPath",get:function get(){return this._withPath},set:function set(val){this.setAttribute(with_path,val)}}]);return _class2}(superClass)}(XtalStateBase));define(XtalStateCommit);var XtalStateUpdate=function(_XtalStateCommit){babelHelpers.inherits(XtalStateUpdate,_XtalStateCommit);function XtalStateUpdate(){babelHelpers.classCallCheck(this,XtalStateUpdate);return babelHelpers.possibleConstructorReturn(this,(XtalStateUpdate.__proto__||Object.getPrototypeOf(XtalStateUpdate)).apply(this,arguments))}babelHelpers.createClass(XtalStateUpdate,[{key:"mergeDeep",value:function mergeDeep(target,source){if("object"!==babelHelpers.typeof(target))return;if("object"!==babelHelpers.typeof(source))return;for(var key in source){var sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}switch(babelHelpers.typeof(sourceVal)){case"object":switch(babelHelpers.typeof(targetVal)){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}},{key:"mergedHistory",value:function mergedHistory(){var sm=babelHelpers.get(XtalStateUpdate.prototype.__proto__||Object.getPrototypeOf(XtalStateUpdate.prototype),"mergedHistory",this).call(this);if(sm===void 0)return;if(null===this._window.history.state)return sm;var retObj=Object.assign({},this._window.history.state);return this.mergeDeep(retObj,this.wrap(this._history))}}],[{key:"is",get:function get(){return"xtal-state-update"}}]);return XtalStateUpdate}(XtalStateCommit);define(XtalStateUpdate);var watch="watch",xtal_subscribers="xtal-subscribers",XtalStateWatch=function(_XtalStateBase){babelHelpers.inherits(XtalStateWatch,_XtalStateBase);babelHelpers.createClass(XtalStateWatch,null,[{key:"is",get:function get(){return"xtal-state-watch"}}]);function XtalStateWatch(){babelHelpers.classCallCheck(this,XtalStateWatch);return babelHelpers.possibleConstructorReturn(this,(XtalStateWatch.__proto__||Object.getPrototypeOf(XtalStateWatch)).call(this))}babelHelpers.createClass(XtalStateWatch,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){babelHelpers.get(XtalStateWatch.prototype.__proto__||Object.getPrototypeOf(XtalStateWatch.prototype),"attributeChangedCallback",this).call(this,name,oldValue,newValue);switch(name){case watch:this._watch=null!==newValue;break;}this.notify()}},{key:"addSubscribers",value:function addSubscribers(){var _this10=this;if(this._notReady){setTimeout(function(){_this10.addSubscribers()},50);return}var win=this._window;if(!win[xtal_subscribers]){win[xtal_subscribers]=[];var originalPushState=win.history.pushState,boundPushState=originalPushState.bind(win.history);win.history.pushState=function(newState,title,URL){boundPushState(newState,title,URL);win[xtal_subscribers].forEach(function(subscriber){subscriber.history=newState})};var originalReplaceState=win.history.replaceState,boundReplaceState=originalReplaceState.bind(win.history);win.history.replaceState=function(newState,title,URL){boundReplaceState(newState,title,URL);win[xtal_subscribers].forEach(function(subscriber){subscriber.history=newState})};win.addEventListener("popstate",function(){win[xtal_subscribers].forEach(function(subscriber){subscriber.history=history.state})})}this._window[xtal_subscribers].push(this);this._connected=!0;this.history=this._window.history.state}},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(XtalStateWatch.prototype.__proto__||Object.getPrototypeOf(XtalStateWatch.prototype),"connectedCallback",this).call(this);this.addSubscribers()}},{key:"notify",value:function notify(){if(!this._watch||this._disabled||!this._connected||this._history===void 0)return;this.de("history",{value:this._history})}},{key:"history",get:function get(){return this._history},set:function set(newVal){this._history=newVal;if(this._watch)this.notify()}},{key:"watch",get:function get(){return this._watch},set:function set(newVal){this.attr(watch,newVal,"")}}],[{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateWatch.__proto__||Object.getPrototypeOf(XtalStateWatch),"observedAttributes",this).concat([watch])}}]);return XtalStateWatch}(XtalStateBase);define(XtalStateWatch);var with_url_pattern="with-url-pattern",parse="parse",XtalStateParse=function(_XtalStateBase2){babelHelpers.inherits(XtalStateParse,_XtalStateBase2);function XtalStateParse(){babelHelpers.classCallCheck(this,XtalStateParse);return babelHelpers.possibleConstructorReturn(this,(XtalStateParse.__proto__||Object.getPrototypeOf(XtalStateParse)).apply(this,arguments))}babelHelpers.createClass(XtalStateParse,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){babelHelpers.get(XtalStateParse.prototype.__proto__||Object.getPrototypeOf(XtalStateParse.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);switch(name){case with_url_pattern:this._withURLPattern=newVal;break;case parse:this["_"+name]=newVal;break;default:babelHelpers.get(XtalStateParse.prototype.__proto__||Object.getPrototypeOf(XtalStateParse.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);return;}this.onParsePropsChange()}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(["withURLPattern",parse]);babelHelpers.get(XtalStateParse.prototype.__proto__||Object.getPrototypeOf(XtalStateParse.prototype),"connectedCallback",this).call(this);this.onParsePropsChange()}},{key:"onParsePropsChange",value:function onParsePropsChange(){this._window.history.replaceState(XtalStateParse.parseAddressBar(this._parse,this._withURLPattern),"",this._window.location.href)}},{key:"withURLPattern",get:function get(){return this._withURLPattern},set:function set(val){this.attr(with_url_pattern,val)}},{key:"parse",get:function get(){return this._parse},set:function set(val){this.attr(parse,val)}}],[{key:"parseAddressBar",value:function parseAddressBar(parsePath,urlPattern){var reg=new RegExp(urlPattern),thingToParse=self;parsePath.split(".").forEach(function(token){if(thingToParse)thingToParse=thingToParse[token]});var parsed=reg.exec(thingToParse);if(!parsed)return;return parsed.groups}},{key:"is",get:function get(){return"xtal-state-parse"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateParse.__proto__||Object.getPrototypeOf(XtalStateParse),"observedAttributes",this).concat([with_url_pattern,parse])}}]);return XtalStateParse}(XtalStateBase);define(XtalStateParse)})();