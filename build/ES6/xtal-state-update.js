import{XtalStateCommit}from"./xtal-state-commit.js";import{define}from"./node_modules/xtal-latx/define.js";export class XtalStateUpdate extends XtalStateCommit{static get is(){return"xtal-state-update"}mergeDeep(target,source){if("object"!==typeof target)return;if("object"!==typeof source)return;for(const key in source){const sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}switch(typeof sourceVal){case"object":switch(typeof targetVal){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}mergedHistory(){if(null===this._window.history.state)return this._history;const retObj=Object.assign({},this._window.history.state);return this.mergeDeep(retObj,this._history)}}define(XtalStateUpdate);