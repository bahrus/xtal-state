export function UrlFormatter(superClass) {
    return class extends superClass {
        adjustUrl(url) {
            if (this.stringifyFn) {
                url = this.stringifyFn(this);
            }
            else if (this.replaceUrlValue && this.urlSearch) {
                const reg = new RegExp(this.urlSearch);
                url = url.replace(reg, this.replaceUrlValue);
            }
            return url;
        }
    };
}
