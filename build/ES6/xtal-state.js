(function(){function define(custEl){let tagName=custEl.is;if(customElements.get(tagName)){console.warn("Already registered "+tagName);return}customElements.define(tagName,custEl)}const debounce=(fn,time)=>{let timeout;return function(){clearTimeout(timeout);timeout=setTimeout(()=>fn.apply(this,arguments),time)}},disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){const v=val?"set":"remove";this[v+"Attribute"](name,trueVal||val)}to$(n){const mod=n%2;return(n-mod)/2+"-"+mod}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr("data-"+name,this.to$(ec[name]))}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail,asIs){const eventName=name+(asIs?"":"-changed"),newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}const with_path="with-path";function WithPath(superClass){return class extends superClass{get withPath(){return this._withPath}set withPath(val){this.setAttribute(with_path,val)}wrap(obj){if(this._withPath){let mergedObj={};const retObj=mergedObj,splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach((pathToken,idx)=>{if(idx===lenMinus1){mergedObj[pathToken]=obj}else{mergedObj=mergedObj[pathToken]={}}});return retObj}else{return obj}}}}const level="level";function getIFrmWin(par,callBack){let ifr=par.querySelector("iframe[xtal-state]");if(null===ifr){ifr=document.createElement("iframe");ifr.setAttribute("xtal-state","");ifr.addEventListener("load",()=>{ifr.setAttribute("loaded","");if(null!==callBack)callBack(ifr)});ifr.src="blank.html";ifr.style.display="none";par.appendChild(ifr)}else{if(!ifr.hasAttribute("loaded")){ifr.addEventListener("load",()=>{if(null!==callBack)callBack(ifr)})}else{if(null!==callBack)callBack(ifr)}}return ifr.contentWindow}function getMchPar(el,level){let test=el.parentElement;while(test){if(test.matches(level))return test;test=test.parentElement}}function getWinCtx(el,level){return new Promise(resolve=>{switch(level){case"global":resolve(self);break;case"local":getIFrmWin(el.parentElement,ifrm=>resolve(ifrm.contentWindow));break;case"shadow":this._window=getIFrmWin(getHost(this),ifrm=>resolve(ifrm.contentWindow));break;default:this._window=getIFrmWin(getMchPar(el,level),ifrm=>resolve(ifrm.contentWindow));}})}class XtalStateBase extends XtallatX(HTMLElement){constructor(){super(...arguments);this._level="global"}get level(){return this._level}set level(val){this.attr(level,val)}static get observedAttributes(){return super.observedAttributes.concat([level])}get window(){return this._window}attributeChangedCallback(name,oldVal,newVal){super.attributeChangedCallback(name,oldVal,newVal);switch(name){case level:this._level=newVal;break;}this.onPropsChange()}connectedCallback(){this.style.display="none";this._upgradeProperties(["disabled",level]);this._conn=!0;this.onPropsChange()}onPropsChange(){if(!this._conn||this._disabled)return!0;if(!this._window){this._notReady=!0;getWinCtx(this,this._level).then(win=>{this._window=win;this._notReady=!1})}if(this._notReady)return!0}}const make="make",rewrite="rewrite",title="title",url="url",url_search="url-search",replace_url_value="replace-url-value",new$$="new";class XtalStateCommit extends WithPath(XtalStateBase){constructor(){super(...arguments);this._title=""}static get is(){return"xtal-state-commit"}get make(){return this._make}set make(val){this.attr(make,val,"")}get rewrite(){return this._rewrite}set rewrite(val){this.attr(rewrite,val,"")}get history(){return this._window.history.state}set history(newVal){this._history=newVal;this.onPropsChange()}get title(){return this._title}set title(val){this.attr(title,val)}get url(){return this._url}set url(val){this.attr(url,val)}get urlSearch(){return this._urlSearch}set urlSearch(val){this.attr(url_search,val)}get stringifyFn(){return this._stringifyFn}set stringifyFn(nv){this._stringifyFn=nv}set syncHistory(nv){this.value=nv;this.de("history",{value:nv})}get replaceUrlValue(){return this._replaceUrlValue}set replaceUrlValue(val){this.attr(replace_url_value,val)}get new(){return this._new}set new(v){this.attr(new$$,v,"")}static get observedAttributes(){return super.observedAttributes.concat([make,rewrite,title,url,with_path,url_search,replace_url_value,new$$])}attributeChangedCallback(n,ov,nv){switch(n){case new$$:case rewrite:case make:this["_"+n]=null!==nv;break;case url:case title:this["_"+n]=nv;break;case with_path:this._withPath=nv;break;case url_search:this._urlSearch=nv;break;case replace_url_value:this._replaceUrlValue=nv;break;}super.attributeChangedCallback(n,ov,nv)}connectedCallback(){this._upgradeProperties([make,rewrite,title,url,"withPath","urlSearch","replaceUrlValue","stringifyFn",new$$].concat(["history"]));this._debouncer=debounce(()=>{this.updateHistory()},50);super.connectedCallback()}onPropsChange(){if(this._disabled)return;if(super.onPropsChange()){if(this._notReady){setTimeout(()=>{this.onPropsChange()},50);return}return!0}if(!this._make&&!this._rewrite)return!0;this._debouncer()}mergedHistory(){if(this._history===void 0)return;return this.wrap(this._history)}updateHistory(){const hist=this._new?{}:this.mergedHistory();if(null===hist||hist===void 0)return;const method=this.make?"push":"replace";this.value=hist;this._disabled=!0;this.de("history",{value:hist});this._disabled=!1;if(this.make&&!this.url)return;let url=this._url;if(!url||this._new){if(!this._replaceUrlValue||this._new){url=this._window.location.href}}if(!url)return;if(this._stringifyFn){url=this._stringifyFn(this)}else if(this._replaceUrlValue&&this._urlSearch){const reg=new RegExp(this._urlSearch);url=url.replace(reg,this._replaceUrlValue)}this._window.history[method+"State"](hist,this._title,url)}}define(XtalStateCommit);class XtalStateUpdate extends XtalStateCommit{static get is(){return"xtal-state-update"}mergeDeep(target,source){if("object"!==typeof target)return;if("object"!==typeof source)return;for(const key in source){const sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}switch(typeof sourceVal){case"object":switch(typeof targetVal){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}mergedHistory(){const sm=super.mergedHistory();if(sm===void 0)return;if(null===this._window.history.state)return sm;const retObj=Object.assign({},this._window.history.state);return this.mergeDeep(retObj,this.wrap(this._history))}}define(XtalStateUpdate);const watch="watch",xtal_subscribers="xtal-subscribers",popstate="popstate";function remove(array,element){const index=array.indexOf(element);if(-1!==index){array.splice(index,1)}}class XtalStateWatch extends XtalStateBase{static get is(){return"xtal-state-watch"}constructor(){super()}static get observedAttributes(){return super.observedAttributes.concat([watch])}attributeChangedCallback(name,oldValue,nv){super.attributeChangedCallback(name,oldValue,nv);switch(name){case watch:this._watch=""===nv?"all":popstate;break;}this.notify()}addSubscribers(){if(this._notReady){setTimeout(()=>{this.addSubscribers()},50);return}const win=this._window;if(!win[xtal_subscribers]){win[xtal_subscribers]=[];const originalPushState=win.history.pushState,boundPushState=originalPushState.bind(win.history);win.history.pushState=function(newState,title,URL){boundPushState(newState,title,URL);win[xtal_subscribers].forEach(subscriber=>{delete subscriber.dataset.popstate;subscriber.history=newState})};const originalReplaceState=win.history.replaceState,boundReplaceState=originalReplaceState.bind(win.history);win.history.replaceState=function(newState,title,URL){boundReplaceState(newState,title,URL);win[xtal_subscribers].forEach(subscriber=>{delete subscriber.dataset.popstate;subscriber.history=newState})};win.addEventListener(popstate,()=>{win[xtal_subscribers].forEach(subscriber=>{subscriber.dataset.popstate="true";subscriber.history=win.history.state})})}this._window[xtal_subscribers].push(this);this._connected=!0;this.history=this._window.history.state}connectedCallback(){this._upgradeProperties([watch]);super.connectedCallback();this.addSubscribers()}disconnect(){if(this._window){const subs=this._window[xtal_subscribers];if(subs)remove(subs,this)}}disconnectedCallback(){this.disconnect()}get history(){return this._history}set history(newVal){this._history=newVal;if(this._watch)this.notify()}get watch(){return this._watch}set watch(nv){this.attr(watch,nv)}notify(){if(!this._watch||this._disabled||!this._connected||this._history===void 0||null===this._history)return;const ds=this.dataset;let doIt=!1;switch(this._watch){case"all":doIt=!0;break;case popstate:doIt=!ds.historyChanged||"true"===ds.popstate;break;}if(!doIt)return;this.de("history",{value:this._history})}}define(XtalStateWatch);const with_url_pattern="with-url-pattern",parse="parse",init_history_if_null="init-history-if-null";class XtalStateParse extends XtalStateBase{static get is(){return"xtal-state-parse"}static get observedAttributes(){return super.observedAttributes.concat([with_url_pattern,parse,init_history_if_null])}attributeChangedCallback(name,oldVal,newVal){super.attributeChangedCallback(name,oldVal,newVal);switch(name){case with_url_pattern:this._withURLPattern=newVal;break;case parse:this["_"+name]=newVal;break;default:super.attributeChangedCallback(name,oldVal,newVal);return;}this.onParsePropsChange()}get withURLPattern(){return this._withURLPattern}set withURLPattern(val){this.attr(with_url_pattern,val)}get parse(){return this._parse}set parse(val){this.attr(parse,val)}get parseFn(){return this._parseFn}set parseFn(nv){this._parseFn=nv;this.onParsePropsChange()}get initHistoryIfNull(){return this._initHistoryIfNull}set initHistoryIfNull(nv){this.attr(init_history_if_null,nv,"")}connectedCallback(){this._upgradeProperties(["withURLPattern",parse,"initHistoryIfNull","parseFn"]);super.connectedCallback();this.onParsePropsChange()}onPropsChange(){if(this._initHistoryIfNull)return!1;return super.onPropsChange()}get noMatch(){return this._noMatch}set noMatch(val){this._noMatch=val;this.attr("no-match",val.toString())}onParsePropsChange(){if(this._disabled||this.value||this.noMatch)return;if(!this._window){setTimeout(()=>{this.onParsePropsChange()},50);return}if(this._initHistoryIfNull&&null!==this._window.history.state){return}let value=null;if(this._withURLPattern){value=XtalStateParse.parseAddressBar(this._parse,this._withURLPattern,this._window);if(-1===value){if(!this._parseFn)return;const prseString=XtalStateParse.getObj(this._parse,this._window);value=this._parseFn(prseString,this)}}if(null===value){this.noMatch=!0;this.de("no-match-found",{value:!0},!0);return}else{this.value=value;this.de("match-found",{value:value},!0)}if(this._initHistoryIfNull)this._window.history.replaceState(value,"",this._window.location.href)}static getObj(parsePath,winObj){let thingToParse=winObj;parsePath.split(".").forEach(token=>{if(thingToParse)thingToParse=thingToParse[token]});return thingToParse}static parseAddressBar(parsePath,urlPattern,winObj){try{const reg=new RegExp(urlPattern);let thingToParse=this.getObj(parsePath,winObj);const parsed=reg.exec(thingToParse);if(!parsed)return null;return parsed.groups}catch(err){return-1}}}define(XtalStateParse)})();