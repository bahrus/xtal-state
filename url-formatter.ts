import {IHydrate} from 'trans-render/types.d.js';
type Constructor<T = {}> = new (...args: any[]) => T;
declare global{
    interface HTMLElement{
        disconnectedCallback() : any;
    }
}

export function UrlFormatter<TBase extends Constructor<IHydrate>>(superClass: TBase) {
    return class extends superClass {
        /**
         * URL to use when calling push/replace state
         */

        url: string;

        /**
         * Regular expression to search url for.
         */
        urlSearch: string;

        
        /**
         * Replace URL expression, coupled with urlSearch
         */
        replaceUrlValue!: string;

        stringifyFn!: (t: any) => string;

        adjustUrl(url: string){
            if(this.stringifyFn){
                url = this.stringifyFn(this);
            }else if(this.replaceUrlValue && this.urlSearch){
                const reg = new RegExp(this.urlSearch);
                url = url.replace(reg, this.replaceUrlValue);
            }
            return url;
        }
    }
}