import {XtalStateUpdate} from './xtal-state-update.js';
import {define} from 'xtal-latx/define.js';
const with_url_pattern = 'with-url-pattern';
const parse = 'parse';

export class XtalStateParse extends XtalStateUpdate{
    static get is(){return 'xtal-state-parse';}
    static get observedAttributes(){return super.observedAttributes.concat([with_url_pattern, parse])}

    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        
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

    connectedCallback(){
        this._upgradeProperties(['withURLPattern', parse]);
        this._title = "Init";
        this._url = location.pathname + location.search;
        this._rewrite = true;
        super.connectedCallback();
        this.onParsePropsChange();
    }

    onParsePropsChange(){
        if(!this._connected || this._disabled || !this._withURLPattern || !this._parse) return;
        this.history = XtalStateParse.parseAddressBar(this._parse, this._withURLPattern);
        //history.replaceState(parsed['groups'], 'Init', location.pathname);
    }

    static parseAddressBar(parsePath: string, urlPattern: string){
        const reg = new RegExp(urlPattern);
        let thingToParse = self;
        parsePath.split('.').forEach(token =>{
            if(thingToParse) thingToParse = thingToParse[token];
        })
        const parsed = reg.exec(<any>thingToParse as string);
        if(!parsed) return;
        return parsed['groups'];
    }
}
define(XtalStateParse);