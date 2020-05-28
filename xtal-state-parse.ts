import {XtalStateBase} from './xtal-state-base.js';
import {define} from 'xtal-element/xtal-latx.js';
import {AttributeProps} from 'xtal-element/types.d.js';


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
    onPropsChange(name: string){
        if(this._disabled || this.value || this.noMatch || !this._connected) return;
        if(!this._checkedNull){
            if(window.history.state === null){
                this.dataset.historyWasNull = 'true';
            }
            this._checkedNull = true;
        }

        let value: any = null;
        if(this.withUrlPattern){
            value = this.parseAddressBar(this.parse, this.withUrlPattern, window);
            if(value === -1){
                if(!this.parseFn) return;
                const prseString = this.getObj(this.parse, window);
                value = this.parseFn(prseString, this);
            }
        }
        if(value === null) {
            this.noMatch = true;
            this.de('no-match-found', {
                value: true,
            }, true);
            return;
        }else{
            this.value = value;
            this.de('match-found', {
                value: value
            }, true);
        }
        if(this.initHistoryIfNull && (window.history.state === null)) window.history.replaceState(value, '', window.location.href);
    }

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