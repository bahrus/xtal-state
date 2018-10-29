import{XtalStateBase}from"./xtal-state-base.js";import{WithPath,with_path}from"./node_modules/xtal-latx/with-path.js";import{define}from"./node_modules/xtal-latx/define.js";import{debounce}from"./node_modules/xtal-latx/debounce.js";const make="make",rewrite="rewrite",history$="history",title="title",url="url",url_search="url-search",replace_url_value="replace-url-value";export class XtalStateCommit extends WithPath(XtalStateBase){constructor(){super(...arguments);this._title=""}static get is(){return"xtal-state-commit"}get make(){return this._make}set make(val){this.attr(make,val,"")}get rewrite(){return this._rewrite}set rewrite(val){this.attr(rewrite,val,"")}get history(){return this._window.history.state}set history(newVal){this._history=newVal;this.onPropsChange()}get title(){return this._title}set title(val){this.attr(title,val)}get url(){return this._url}set url(val){this.attr(url,val)}get urlSearch(){return this._urlSearch}set urlSearch(val){this.attr(url_search,val)}get stringifyFn(){return this._stringifyFn}set stringifyFn(nv){this._stringifyFn=nv}set syncHistory(nv){this.value=nv;this.de("history",{value:nv})}get replaceUrlValue(){return this._replaceUrlValue}set replaceUrlValue(val){this.attr(replace_url_value,val)}static get observedAttributes(){return super.observedAttributes.concat([make,rewrite,title,url,with_path,url_search,replace_url_value])}attributeChangedCallback(n,ov,nv){switch(n){case rewrite:case make:this["_"+n]=null!==nv;break;case url:case title:this["_"+n]=nv;break;case with_path:this._withPath=nv;break;case url_search:this._urlSearch=nv;break;case replace_url_value:this._replaceUrlValue=nv;break;}super.attributeChangedCallback(n,ov,nv)}connectedCallback(){this._upgradeProperties([make,rewrite,title,url,"withPath","urlSearch","replaceUrlValue","stringifyFn"].concat([history$]));this._debouncer=debounce(()=>{this.updateHistory()},50);super.connectedCallback()}onPropsChange(){if(this._disabled)return;if(super.onPropsChange()){if(this._notReady){setTimeout(()=>{this.onPropsChange()},50);return}return!0}if(!this._make&&!this._rewrite)return!0;this._debouncer()}mergedHistory(){if(this._history===void 0)return;return this.wrap(this._history)}updateHistory(){const hist=this.mergedHistory();if(null===hist||hist===void 0)return;const method=this.make?"push":"replace";this.value=hist;this._disabled=!0;this.de("history",{value:hist});this._disabled=!1;if(this.make&&!this.url)return;let url=this._url;if(!url){if(!this._replaceUrlValue){url=this._window.location.href}}if(!url)return;if(this._stringifyFn){url=this._stringifyFn(this)}else if(this._replaceUrlValue&&this._urlSearch){const reg=new RegExp(this._urlSearch);url=url.replace(reg,this._replaceUrlValue)}this._window.history[method+"State"](hist,this._title,url)}}define(XtalStateCommit);