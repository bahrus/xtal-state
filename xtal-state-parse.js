import { XtalStateBase } from './xtal-state-base.js';
import { define, de } from 'xtal-element/xtal-latx.js';
/**
 * @element xtal-state-parse
 */
let XtalStateParse = /** @class */ (() => {
    class XtalStateParse extends XtalStateBase {
        constructor() {
            super(...arguments);
            this._checkedNull = false;
        }
        onPropsChange(name) {
            super.onPropsChange(name);
            if (this.disabled || this.value || this.noMatch || !this._xlConnected)
                return;
            if (!this._checkedNull) {
                if (window.history.state === null) {
                    this.dataset.historyWasNull = 'true';
                }
                this._checkedNull = true;
            }
            let value = null;
            if (this.withUrlPattern) {
                value = this.parseAddressBar(this.parse, this.withUrlPattern, window);
                if (value === -1) {
                    if (!this.parseFn)
                        return;
                    const prseString = this.getObj(this.parse, window);
                    value = this.parseFn(prseString, this);
                }
            }
            if (value === null) {
                this.noMatch = true;
                this[de]('no-match-found', {
                    value: true,
                }, true);
                return;
            }
            else {
                this.value = value;
                this[de]('match-found', {
                    value: value
                }, true);
            }
            if (this.initHistoryIfNull && (window.history.state === null))
                window.history.replaceState(value, '', window.location.href);
        }
        parseAddressBar(parsePath, urlPattern, winObj) {
            try {
                const reg = new RegExp(urlPattern);
                let thingToParse = this.getObj(parsePath, winObj);
                const parsed = reg.exec(thingToParse);
                if (!parsed)
                    return null;
                return Object.assign({}, parsed['groups']); //weird bug(?) in chrome requires this:  parsed groups is a strange type of primitive object with no methods.
            }
            catch (err) {
                return -1;
            }
        }
        getObj(parsePath, winObj) {
            let thingToParse = winObj;
            parsePath.split('.').forEach(token => {
                if (thingToParse)
                    thingToParse = thingToParse[token];
            });
            return thingToParse;
        }
    }
    XtalStateParse.is = 'xtal-state-parse';
    XtalStateParse.attributeProps = ({ disabled, withUrlPattern, parse, parseFn, initHistoryIfNull, guid }) => ({
        bool: [disabled, initHistoryIfNull],
        str: [guid, parse, withUrlPattern],
        obj: [parseFn]
    });
    return XtalStateParse;
})();
export { XtalStateParse };
define(XtalStateParse);
