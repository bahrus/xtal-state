import { IXtallatXI } from 'xtal-element/xtal-latx.js';
import {IHydrate} from 'trans-render/hydrate.js';
type Constructor<T = {}> = new (...args: any[]) => T;
declare global{
    interface HTMLElement{
        disconnectedCallback() : any;
    }
}
const url = 'url';
const url_search = 'url-search';
const replace_url_value = 'replace-url-value';
export function UrlFormatter<TBase extends Constructor<IHydrate>>(superClass: TBase) {
    return class extends superClass {
        _url!: string;
        /**
         * URL to use when calling push/replace state
         */
        get url() {
            return this._url;
        }
        set url(val) {
            this.attr(url, val);
        }

        _urlSearch!: string;
        /**
         * Regular expression to search url for.
         */
        get urlSearch() {
            return this._urlSearch;
        }
        set urlSearch(val) {
            this.attr(url_search, val);
        }

        _replaceUrlValue!: string;
        /**
         * Replace URL expression, coupled with urlSearch
         */
        get replaceUrlValue(){
            return this._replaceUrlValue;
        }
        set replaceUrlValue(val: string){
            this.attr(replace_url_value, val);
        }

        _stringifyFn!: (t: any) => string;
        get stringifyFn(){
            return this._stringifyFn;
        }

        set stringifyFn(nv){
            this._stringifyFn = nv;
        }
        static get UFAttribs() {
            return [url, url_search, replace_url_value];
        }

        attributeChangedCallback(n: string, ov: string, nv: string) {
            switch (n) {
                case url:
                    this['_' + n] = nv;
                    break;
                case url_search:
                    this._urlSearch = nv;
                    break;
                case replace_url_value:
                    this._replaceUrlValue = nv;
                    break;
                 
    
            }
            if(super.attributeChangedCallback) super.attributeChangedCallback(n, ov, nv);
        }
        value: any;
        connectedCallback() {
            this.propUp([url, 'urlSearch', 'replaceUrlValue', 'stringifyFn']);
            if(super.connectedCallback) super.connectedCallback();
        }

        adjustUrl(url: string){
            if(this._stringifyFn){
                url = this._stringifyFn(this);
            }else if(this._replaceUrlValue && this._urlSearch){
                const reg = new RegExp(this._urlSearch);
                url = url.replace(reg, this._replaceUrlValue);
            }
            return url;
        }
    }
}