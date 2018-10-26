import { XtalStateBase } from './xtal-state-base.js';
import { define } from 'xtal-latx/define.js';
const with_url_pattern = 'with-url-pattern';
const parse = 'parse';
const init_history_if_null = 'init-history-if-null';
export class XtalStateParse extends XtalStateBase {
    static get is() { return 'xtal-state-parse'; }
    static get observedAttributes() { return super.observedAttributes.concat([with_url_pattern, parse, init_history_if_null]); }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
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
    get initHistoryIfNull() {
        return this._initHistoryIfNull;
    }
    set initHistoryIfNull(nv) {
        this.attr(init_history_if_null, nv, '');
    }
    connectedCallback() {
        this._upgradeProperties(['withURLPattern', parse, 'initHistoryIfNull']);
        super.connectedCallback();
        this.onParsePropsChange();
    }
    onPropsChange() {
        if (this._initHistoryIfNull)
            return false;
        return super.onPropsChange();
    }
    get noMatch() {
        return this._noMatch;
    }
    set noMatch(val) {
        this._noMatch = val;
        this.attr('no-match', val.toString());
    }
    onParsePropsChange() {
        if (!this._window && this._initHistoryIfNull) {
            setTimeout(() => {
                this.onParsePropsChange();
            }, 50);
            return;
        }
        if (this._initHistoryIfNull && this._window.history.state !== null) {
            return;
        }
        const value = XtalStateParse.parseAddressBar(this._parse, this._withURLPattern);
        if (value === null) {
            this.noMatch = true;
            this.de('no-match', {
                value: true,
            });
            return;
        }
        else {
            this.value = value;
            this.de('value', {
                value: value
            });
        }
        if (this._initHistoryIfNull)
            this._window.history.replaceState(value, '', this._window.location.href);
    }
    static parseAddressBar(parsePath, urlPattern) {
        const reg = new RegExp(urlPattern);
        let thingToParse = self;
        parsePath.split('.').forEach(token => {
            if (thingToParse)
                thingToParse = thingToParse[token];
        });
        const parsed = reg.exec(thingToParse);
        if (!parsed)
            return null;
        return parsed['groups'];
    }
}
define(XtalStateParse);
//# sourceMappingURL=xtal-state-parse.js.map