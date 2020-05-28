import { XtallatX } from 'xtal-element/xtal-latx.js';
import {PropAction} from 'xtal-element/types.d.js';
import {hydrate} from 'trans-render/hydrate.js';
import {StoreKeeper} from './StoreKeeper.js';

export class XtalStateBase extends XtallatX(hydrate(HTMLElement)){

    /**
     * 
     */
    guid: string;

    _storeKeeper : StoreKeeper | undefined;

    constructor(){
        super();
        this.propActions = [
            ({guid, self} : XtalStateBase) =>{
                if(guid !== undefined){
                    self._storeKeeper = new StoreKeeper(guid);
                }
            } 
        ] as PropAction[];
    }


    disconnectedCallback(){
        if(this._storeKeeper) this._storeKeeper.forget();
    }

    connectedCallback(){
        super.connectedCallback();
        this.onPropsChange('disabled');
    }

}