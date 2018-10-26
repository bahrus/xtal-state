import{XtalStateBase}from"./xtal-state-base.js";import{WithPath,with_path}from"./node_modules/xtal-latx/with-path.js";import{define}from"./node_modules/xtal-latx/define.js";import{debounce}from"./node_modules/xtal-latx/debounce.js";var make="make",rewrite="rewrite",history$="history",title="title",url="url",url_search="url-search",replace_url_value="replace-url-value";export var XtalStateCommit=function(_WithPath){babelHelpers.inherits(XtalStateCommit,_WithPath);function XtalStateCommit(){var _this;babelHelpers.classCallCheck(this,XtalStateCommit);_this=babelHelpers.possibleConstructorReturn(this,(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit)).apply(this,arguments));_this._title="";return _this}babelHelpers.createClass(XtalStateCommit,[{key:"attributeChangedCallback",value:function attributeChangedCallback(n,ov,nv){switch(n){case rewrite:case make:this["_"+n]=null!==nv;break;case url:case title:this["_"+n]=nv;break;case with_path:this._withPath=nv;break;case url_search:this._urlSearch=nv;break;case replace_url_value:this._replaceUrlValue=nv;break;}babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"attributeChangedCallback",this).call(this,n,ov,nv)}},{key:"connectedCallback",value:function connectedCallback(){var _this2=this;this._upgradeProperties([make,rewrite,title,url,"withPath","urlSearch","replaceUrlValue"].concat([history$]));this._debouncer=debounce(function(){_this2.updateHistory()},50);babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"connectedCallback",this).call(this)}},{key:"onPropsChange",value:function onPropsChange(){var _this3=this;if(this._disabled)return;if(babelHelpers.get(XtalStateCommit.prototype.__proto__||Object.getPrototypeOf(XtalStateCommit.prototype),"onPropsChange",this).call(this)){if(this._notReady){setTimeout(function(){_this3.onPropsChange()},50);return}return!0}if(!this._make&&!this._rewrite)return!0;this._debouncer()}},{key:"mergedHistory",value:function mergedHistory(){if(this._history===void 0)return;return this.wrap(this._history)}},{key:"updateHistory",value:function updateHistory(){var hist=this.mergedHistory();if(null===hist||hist===void 0)return;var method=this.make?"push":"replace",bH=this._window.history;this.value=hist;this._disabled=!0;this.de("history",{value:hist});this._disabled=!1;if(this.make&&!this.url)return;var url=this._url;if(!url){if(!this._replaceUrlValue){url=this._window.location.href}}if(!url)return;if(this._replaceUrlValue&&this._urlSearch){var reg=new RegExp(this._urlSearch);url=url.replace(reg,this._replaceUrlValue)}this._window.history[method+"State"](hist,this._title,url)}},{key:"make",get:function get(){return this._make},set:function set(val){this.attr(make,val,"")}},{key:"rewrite",get:function get(){return this._rewrite},set:function set(val){this.attr(rewrite,val,"")}},{key:"history",get:function get(){return this._window.history.state},set:function set(newVal){this._history=newVal;this.onPropsChange()}},{key:"title",get:function get(){return this._title},set:function set(val){this.attr(title,val)}},{key:"url",get:function get(){return this._url},set:function set(val){this.attr(url,val)}},{key:"urlSearch",get:function get(){return this._urlSearch},set:function set(val){this.attr(url_search,val)}},{key:"replaceUrlValue",get:function get(){return this._replaceUrlValue},set:function set(val){this.attr(replace_url_value,val)}}],[{key:"is",get:function get(){return"xtal-state-commit"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateCommit.__proto__||Object.getPrototypeOf(XtalStateCommit),"observedAttributes",this).concat([make,rewrite,title,url,with_path,url_search,replace_url_value])}}]);return XtalStateCommit}(WithPath(XtalStateBase));define(XtalStateCommit);