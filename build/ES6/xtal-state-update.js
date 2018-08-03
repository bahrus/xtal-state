import{XtalStateCommit}from"./xtal-state-commit.js";const wherePath2="where-path";export class XtalStateUpdate extends XtalStateCommit{static get is(){return"xtal-state-update"}get wherePath(){return this._wherePath}set wherePath(val){this.setAttribute(wherePath2,val)}static get observedAttributes(){return super.observedAttributes.concat([wherePath2])}attributeChangedCallback(name,oldVal,newVal){switch(name){case wherePath2:this._wherePath=newVal;break;}super.attributeChangedCallback(name,oldVal,newVal);this.onPropsChange()}namespaceHistory(history){if(!this._wherePath)return history;const returnObj={};let currPath=returnObj;const tokens=this._wherePath.split("."),len=tokens.length-1;let count=0;tokens.forEach(path=>{currPath[path]=count===len?this._namespacedHistoryUpdate:{};currPath=currPath[path];count++});return returnObj}mergeDeep(target,source){if("object"!==typeof target)return;if("object"!==typeof source)return;for(const key in source){const sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}switch(typeof sourceVal){case"object":switch(typeof targetVal){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}preProcess(stateUpdate){stateUpdate.wherePath=this._wherePath;XtalStateUpdate._lastPath=this._wherePath;this.de("pre-history-merge",{value:stateUpdate});if(!stateUpdate.completed){if(stateUpdate.customUpdater){stateUpdate.completed=!0;const update=stateUpdate.customUpdater(stateUpdate);if(update.proposedState.then&&typeof("function"===update.proposedState.then)){update.then(newDetail=>{this._debouncer(newDetail)})}}else{let newState=window.history.state?Object.assign({},window.history.state):{};this.mergeDeep(newState,this._namespacedHistoryUpdate)}}}}if(!customElements.get(XtalStateUpdate.is)){customElements.define(XtalStateUpdate.is,XtalStateUpdate)}