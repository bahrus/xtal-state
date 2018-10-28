import {XtalStateBase} from './xtal-state-base.js';
import {define} from 'xtal-latx/define.js';
const with_url_pattern = 'with-url-pattern';
const parse = 'parse';
const init_history_if_null = 'init-history-if-null';

export class XtalStateParse extends XtalStateBase{
    static get is(){return 'xtal-state-parse';}
    static get observedAttributes(){return super.observedAttributes.concat([with_url_pattern, parse, init_history_if_null])}

    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        super.attributeChangedCallback(name, oldVal, newVal);
        switch(name){
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

    _withURLPattern: string;
    get withURLPattern(){
        return this._withURLPattern;
    }
    set withURLPattern(val){
        this.attr(with_url_pattern, val);
    }

    _parse: string;
    get parse(){
        return this._parse;
    }
    set parse(val){
        this.attr(parse, val);
    }

    _parseFn: (s: string, t: XtalStateParse) => any;
    get parseFn(){
        return this._parseFn;
    }
    set parseFn(nv){
        this._parseFn = nv;
        this.onParsePropsChange();
    }

    _initHistoryIfNull: boolean;
    get initHistoryIfNull(){
        return this._initHistoryIfNull;
    }
    set initHistoryIfNull(nv){
        this.attr(init_history_if_null, nv, '');
    }

    connectedCallback(){
        this._upgradeProperties(['withURLPattern', parse, 'initHistoryIfNull', 'parseFn']);
        super.connectedCallback();
        this.onParsePropsChange();
    }
    onPropsChange() : boolean{
        if(this._initHistoryIfNull) return false;
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
    onParsePropsChange(){
        if(this._disabled || this.value || this.noMatch) return;
        if(!this._window){
            setTimeout(() =>{
                this.onParsePropsChange();
            }, 50);
            return;
        }
        if(this._initHistoryIfNull && this._window.history.state !== null){
            return;
        }
        let value: any = null;
        if(this._withURLPattern){
            value = XtalStateParse.parseAddressBar(this._parse, this._withURLPattern, this._window);
            if(value === -1){
                if(!this._parseFn) return;
                const prseString = XtalStateParse.getObj(this._parse, this._window);
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
        if(this._initHistoryIfNull) this._window.history.replaceState(value, '', this._window.location.href);
    }

    static getObj(parsePath, winObj: Window){
        let thingToParse = winObj;
        parsePath.split('.').forEach(token =>{
            if(thingToParse) thingToParse = thingToParse[token];
        })
        return (<any>thingToParse) as string;        
    }

    static parseAddressBar(parsePath: string, urlPattern: string, winObj: Window){
        try{
            const reg = new RegExp(urlPattern);
            let thingToParse = this.getObj(parsePath, winObj);
            const parsed = reg.exec(<any>thingToParse as string);
            if(!parsed) return null;
            return parsed['groups'];
        }catch(err){
            return -1;
        }
    }
}
define(XtalStateParse);