import{XtalStateCommit}from"./xtal-state-commit.js";import{define}from"./node_modules/xtal-latx/define.js";export var XtalStateUpdate=function(_XtalStateCommit){babelHelpers.inherits(XtalStateUpdate,_XtalStateCommit);function XtalStateUpdate(){babelHelpers.classCallCheck(this,XtalStateUpdate);return babelHelpers.possibleConstructorReturn(this,(XtalStateUpdate.__proto__||Object.getPrototypeOf(XtalStateUpdate)).apply(this,arguments))}babelHelpers.createClass(XtalStateUpdate,[{key:"mergeDeep",value:function mergeDeep(target,source){if("object"!==babelHelpers.typeof(target))return;if("object"!==babelHelpers.typeof(source))return;for(var key in source){var sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}switch(babelHelpers.typeof(sourceVal)){case"object":switch(babelHelpers.typeof(targetVal)){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}},{key:"mergedHistory",value:function mergedHistory(){if(null===this._window.history.state)return this._history;var retObj=Object.assign({},this._window.history.state);return this.mergeDeep(retObj,this._history)}}],[{key:"is",get:function get(){return"xtal-state-update"}}]);return XtalStateUpdate}(XtalStateCommit);define(XtalStateUpdate);