import { XtallatX } from 'xtal-element/xtal-latx.js';
import {hydrate} from 'trans-render/hydrate.js';
import {StoreKeeper} from './StoreKeeper.js';

export class XtalStateBase extends XtallatX(hydrate(HTMLElement)){

    /**
     * 
     */
    guid: string;

    _storeKeeper : StoreKeeper | undefined;


    onPropsChange(name: string){
        super.onPropsChange(name);
        switch(name){
            case 'guid':
                if(this.guid !== undefined){
                    this._storeKeeper = new StoreKeeper(this.guid);
                }
                break;
        }
    }

    disconnectedCallback(){
        if(this._storeKeeper) this._storeKeeper.forget();
    }

}