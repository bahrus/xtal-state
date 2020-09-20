import { XtalStateBase } from './xtal-state-base.js';
import { define, de } from 'xtal-element/xtal-latx.js';
const linkValue = ({ disabled, value, noMatch, _xlConnected, self, withUrlPattern, initHistoryIfNull }) => {
    //value only gets set once
    if (disabled || value !== undefined || noMatch || !_xlConnected)
        return;
    if (!self._checkedNull) {
        if (window.history.state === null) {
            self.dataset.historyWasNull = 'true';
        }
        self._checkedNull = true;
    }
    let val = null;
    if (withUrlPattern !== undefined) {
        val = self.parseAddressBar(self.parse, withUrlPattern, window);
        if (val === -1) {
            if (!self.parseFn)
                return;
            const prseString = self.getObj(self.parse, window);
            val = self.parseFn(prseString, self);
        }
    }
    if (val === null) {
        self.noMatch = true;
        self[de]('no-match-found', {
            value: true,
        }, true);
        return;
    }
    else {
        self.value = val;
        self[de]('match-found', {
            value: val
        }, true);
    }
    if (initHistoryIfNull && (window.history.state === null))
        window.history.replaceState(val, '', window.location.href);
};
/**
 * @element xtal-state-parse
 * @event
 */
export class XtalStateParse extends XtalStateBase {
    constructor() {
        super(...arguments);
        this._checkedNull = false;
        this.propActions = [linkValue];
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
/**
 * @private
 */
XtalStateParse.is = 'xtal-state-parse';
XtalStateParse.attributeProps = ({ withUrlPattern, parse, parseFn, initHistoryIfNull, guid }) => ({
    bool: [initHistoryIfNull],
    str: [guid, parse, withUrlPattern],
    obj: [parseFn]
});
define(XtalStateParse);
