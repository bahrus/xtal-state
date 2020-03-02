import {XtalStateBase} from './xtal-state-base.js';
import {define} from 'trans-render/define.js';
const with_url_pattern = 'with-url-pattern';
const parse = 'parse';
const init_history_if_null = 'init-history-if-null';

/**
 * @element xtal-state-parse
 */
export class XtalStateParse extends XtalStateBase{
    static get is(){return 'xtal-state-parse';}
    static get observedAttributes(){return super.observedAttributes.concat([with_url_pattern, parse, init_history_if_null])}

    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        
        switch(name){
            case with_url_pattern:
                this._withURLPattern = newVal;
                break;
            case init_history_if_null:
                this._initHistoryIfNull = newVal !== null;
                break;
            case parse:
                this['_' + name] = newVal;
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onParsePropsChange();
    }

    _withURLPattern: string;
    get withURLPattern(){
        return this._withURLPattern;
    }
    /**
     * Pattern to match for, using ES2018 named capture groups
     * @attr with-url-pattern
     */
    set withURLPattern(val){
        this.attr(with_url_pattern, val);
    }

    _parse: string;
    get parse(){
        return this._parse;
    }
    /**
     * Global string to parse. Example:  location.href
     */
    set parse(val){
        this.attr(parse, val);
    }

    _parseFn: (s: string, t: XtalStateParse) => any;
    get parseFn(){
        return this._parseFn;
    }
    /**
     * Function to parse address bar.
     */
    set parseFn(nv){
        this._parseFn = nv;
        this.onParsePropsChange();
    }

    _initHistoryIfNull: boolean;
    get initHistoryIfNull(){
        return this._initHistoryIfNull;
    }
    /**
     * Place parsed object into history.state if history.state is null
     * @attr init-history-if-null
     */
    set initHistoryIfNull(nv){
        this.attr(init_history_if_null, nv, '');
    }
    connectedCallback(){
        this.propUp(['withURLPattern', parse, 'initHistoryIfNull', 'parseFn']);
        super.connectedCallback();
        this.onParsePropsChange();
    }
    onPropsChange() : boolean{
        if(this._initHistoryIfNull || !this._conn) return false;
        return super.onPropsChange();
    }
    value: any;
    _noMatch: boolean;
    get noMatch(){
        return this._noMatch;
    }
    set noMatch(val){
        this._noMatch = val;
        this.attr('no-match', val.toString());
    }
    _checkedNull: boolean = false;
    onParsePropsChange(){
        if(this._disabled || this.value || this.noMatch || !this._conn) return;
        if(!this._checkedNull){
            if(window.history.state === null){
                this.dataset.historyWasNull = 'true';
            }
            this._checkedNull = true;
        }

        let value: any = null;
        if(this._withURLPattern){
            value = this.parseAddressBar(this._parse, this._withURLPattern, window);
            if(value === -1){
                if(!this._parseFn) return;
                const prseString = this.getObj(this._parse, window);
                value = this._parseFn(prseString, this);
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
        if(this._initHistoryIfNull && (window.history.state === null)) window.history.replaceState(value, '', window.location.href);
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