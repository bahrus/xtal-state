import {XtalStateBase} from './xtal-state-base.js';
import {define, de} from 'xtal-element/xtal-latx.js';
import {AttributeProps} from 'xtal-element/types.d.js';

const linkCheckedNull = ({self, disabled}: XtalStateParse) => {
    if(!self._checkedNull){
        if(window.history.state === null){
            self.dataset.historyWasNull = 'true';
        }
        self._checkedNull = true;
    }
}

const linkValue = ({disabled, value, noMatch, _xlConnected, self, withUrlPattern, initHistoryIfNull, parseFn}: XtalStateParse) => {
    //value only gets set once
    if(disabled || value !== undefined || noMatch || !_xlConnected || (withUrlPattern === undefined && parseFn === undefined)) return;
    let val: any = null;
    if(parseFn !== undefined){
        const prseString = self.getObj(self.parse, window);
        val = self.parseFn(prseString, self);
    }else{
        val = self.parseAddressBar(self.parse, withUrlPattern, window);
    }
    if(val === null) {
        self.noMatch = true;
        self[de]('no-match-found', {
            value: true,
        }, true);
        return;
    }else{
        self.value = val;
        self[de]('match-found', {
            value: val
        }, true);
    }
    if(initHistoryIfNull && (window.history.state === null)) window.history.replaceState(val, '', window.location.href);  
}

/**
 * @element xtal-state-parse
 * @event 
 */
export class XtalStateParse extends XtalStateBase{

    /**
     * @private
     */
    static is = 'xtal-state-parse';

    static attributeProps = ({withUrlPattern, parse, parseFn, initHistoryIfNull, guid, value}: XtalStateParse) => ({
        bool: [initHistoryIfNull],
        str: [guid, parse, withUrlPattern],
        obj: [parseFn, value],
        notify: [value]
    }) as AttributeProps;

    /**
     * Pattern to match for, using ES2018 named capture groups
     * @attr with-url-pattern
     */
    withUrlPattern: string;

    /**
     * Global string to parse. Example:  location.href
     */
    parse: string;

    /**
     * Function to parse address bar.
     */
    parseFn: (s: string, t: XtalStateParse) => any;

    /**
     * Place parsed object into history.state if history.state is null
     * @attr init-history-if-null
     */
    initHistoryIfNull: boolean;

    value: any;

    noMatch: boolean;

    _checkedNull: boolean = false;

    propActions = [linkCheckedNull, linkValue];

    parseAddressBar(parsePath: string, urlPattern: string, winObj: Window){
        try{
            const reg = new RegExp(urlPattern);
            let thingToParse = this.getObj(parsePath, winObj);
            const parsed = reg.exec(<any>thingToParse as string);
            if(!parsed) return null;
            return Object.assign({}, parsed['groups']); //weird bug(?) in chrome requires this:  parsed groups is a strange type of primitive object with no methods.
        }catch(err){
            return -1;
        }
    }

    getObj(parsePath, winObj: Window){
        let thingToParse = winObj;
        parsePath.split('.').forEach(token =>{
            if(thingToParse) thingToParse = thingToParse[token];
        })
        return (<any>thingToParse) as string;        
    }


}
define(XtalStateParse);