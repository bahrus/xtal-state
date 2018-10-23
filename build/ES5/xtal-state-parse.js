import{XtalStateBase}from"./xtal-state-base.js";import{define}from"./node_modules/xtal-latx/define.js";var with_url_pattern="with-url-pattern",parse="parse";export var XtalStateParse=function(_XtalStateBase){babelHelpers.inherits(XtalStateParse,_XtalStateBase);function XtalStateParse(){babelHelpers.classCallCheck(this,XtalStateParse);return babelHelpers.possibleConstructorReturn(this,(XtalStateParse.__proto__||Object.getPrototypeOf(XtalStateParse)).apply(this,arguments))}babelHelpers.createClass(XtalStateParse,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){babelHelpers.get(XtalStateParse.prototype.__proto__||Object.getPrototypeOf(XtalStateParse.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);switch(name){case with_url_pattern:this._withURLPattern=newVal;break;case parse:this["_"+name]=newVal;break;default:babelHelpers.get(XtalStateParse.prototype.__proto__||Object.getPrototypeOf(XtalStateParse.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);return;}this.onParsePropsChange()}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(["withURLPattern",parse]);babelHelpers.get(XtalStateParse.prototype.__proto__||Object.getPrototypeOf(XtalStateParse.prototype),"connectedCallback",this).call(this);this.onParsePropsChange()}},{key:"onParsePropsChange",value:function onParsePropsChange(){var _this=this;if(!this._window){setTimeout(function(){_this.onParsePropsChange()},50);return}if(null!==this._window.history.state){return}var state=XtalStateParse.parseAddressBar(this._parse,this._withURLPattern);if(null===state){this.de("no-match",{},!0)}this._window.history.replaceState(state,"",this._window.location.href)}},{key:"withURLPattern",get:function get(){return this._withURLPattern},set:function set(val){this.attr(with_url_pattern,val)}},{key:"parse",get:function get(){return this._parse},set:function set(val){this.attr(parse,val)}}],[{key:"parseAddressBar",value:function parseAddressBar(parsePath,urlPattern){var reg=new RegExp(urlPattern),thingToParse=self;parsePath.split(".").forEach(function(token){if(thingToParse)thingToParse=thingToParse[token]});var parsed=reg.exec(thingToParse);if(!parsed)return null;return parsed.groups}},{key:"is",get:function get(){return"xtal-state-parse"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalStateParse.__proto__||Object.getPrototypeOf(XtalStateParse),"observedAttributes",this).concat([with_url_pattern,parse])}}]);return XtalStateParse}(XtalStateBase);define(XtalStateParse);