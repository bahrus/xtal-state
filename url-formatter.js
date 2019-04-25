import { up } from 'trans-render/hydrate.js';
const url = 'url';
const url_search = 'url-search';
const replace_url_value = 'replace-url-value';
export function UrlFormatter(superClass) {
    return class extends superClass {
        /**
         * URL to use when calling push/replace state
         */
        get url() {
            return this._url;
        }
        set url(val) {
            this.attr(url, val);
        }
        /**
         * Regular expression to search url for.
         */
        get urlSearch() {
            return this._urlSearch;
        }
        set urlSearch(val) {
            this.attr(url_search, val);
        }
        /**
         * Replace URL expression, coupled with urlSearch
         */
        get replaceUrlValue() {
            return this._replaceUrlValue;
        }
        set replaceUrlValue(val) {
            this.attr(replace_url_value, val);
        }
        get stringifyFn() {
            return this._stringifyFn;
        }
        set stringifyFn(nv) {
            this._stringifyFn = nv;
        }
        static get UFAttribs() {
            return [url, url_search, replace_url_value];
        }
        attributeChangedCallback(n, ov, nv) {
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
            if (super.attributeChangedCallback)
                super.attributeChangedCallback(n, ov, nv);
        }
        connectedCallback() {
            this[up]([url, 'urlSearch', 'replaceUrlValue', 'stringifyFn']);
            if (super.connectedCallback)
                super.connectedCallback();
        }
        adjustUrl(url) {
            if (this._stringifyFn) {
                url = this._stringifyFn(this);
            }
            else if (this._replaceUrlValue && this._urlSearch) {
                const reg = new RegExp(this._urlSearch);
                url = url.replace(reg, this._replaceUrlValue);
            }
            return url;
        }
    };
}
