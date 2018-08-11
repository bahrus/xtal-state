//import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { XtalStateUpdate } from './xtal-state-update.js';
const with_url_pattern = 'with-url-pattern';
const parse = 'parse';
export class XtalStateParse extends XtalStateUpdate {
    static get is() { return 'xtal-state-parse'; }
    static get observedAttributes() { return super.observedAttributes.concat([with_url_pattern, parse]); }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case with_url_pattern:
                this._withURLPattern = newVal;
                break;
            case parse:
                this['_' + name] = newVal;
                break;
            default:
                super.attributeChangedCallback(name, oldVal, newVal);
                return;
        }
        this.onParsePropsChange();
    }
    get withURLPattern() {
        return this._withURLPattern;
    }
    set withURLPattern(val) {
        this.attr(with_url_pattern, val);
    }
    get parse() {
        return this._parse;
    }
    set parse(val) {
        this.attr(parse, val);
    }
    connectedCallback() {
        this._upgradeProperties(['withURLPattern', parse]);
        this._title = "Init";
        this._url = location.pathname;
        this._rewrite = true;
        super.connectedCallback();
        this.onParsePropsChange();
    }
    onParsePropsChange() {
        if (!this._connected || this._disabled || !this._withURLPattern || history.state || !this._parse)
            return;
        const reg = new RegExp(this._withURLPattern);
        let thingToParse = self;
        this._parse.split('.').forEach(token => {
            if (thingToParse)
                thingToParse = thingToParse[token];
        });
        const parsed = reg.exec(thingToParse);
        if (!parsed)
            return;
        this.history = parsed['groups'];
        //history.replaceState(parsed['groups'], 'Init', location.pathname);
    }
}
customElements.define(XtalStateParse.is, XtalStateParse);
//# sourceMappingURL=xtal-state-parse.js.map