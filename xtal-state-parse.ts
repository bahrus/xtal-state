import {XtalStateBase} from './xtal-state-base.js';
import {define, de} from 'xtal-element/xtal-latx.js';
import {AttributeProps} from 'xtal-element/types.d.js';

const linkValue = ({disabled, value, noMatch, _xlConnected, self, withUrlPattern, initHistoryIfNull}: XtalStateParse) => {
    //value only gets set once
    if(disabled || value !== undefined || noMatch || !_xlConnected) return;
    if(!self._checkedNull){
        if(window.history.state === null){
            self.dataset.historyWasNull = 'true';
        }
        self._checkedNull = true;
    }
    let val: any = null;
    if(withUrlPattern !== undefined){
        val = self.parseAddressBar(self.parse, withUrlPattern, window);
        if(val === -1){
            if(!self.parseFn) return;
            const prseString = self.getObj(self.parse, window);
            val = self.parseFn(prseString, self);
        }
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
 */
export class XtalStateParse extends XtalStateBase{

    static is = 'xtal-state-parse';

    static attributeProps = ({disabled, withUrlPattern, parse, parseFn, initHistoryIfNull, guid}: XtalStateParse) => ({
        bool: [disabled, initHistoryIfNull],
        str: [guid, parse, withUrlPattern],
        obj: [parseFn]
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

    propActions = [linkValue];

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