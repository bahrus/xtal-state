import { XtallatX } from 'xtal-element/xtal-latx.js';
import {PropAction} from 'xtal-element/types.d.js';
import {hydrate} from 'trans-render/hydrate.js';
import {StoreKeeper} from './StoreKeeper.js';

export const linkStoreKeeper = ({guid, self} : XtalStateBase) =>{
    if(guid !== undefined){
        self._storeKeeper = new StoreKeeper(guid);
    }
};

export class XtalStateBase extends XtallatX(hydrate(HTMLElement)){

    /**
     * This needs to be unique across all non shared "stores".
     * 
     * @attr guid
     */
    guid: string;

    _storeKeeper : StoreKeeper | undefined;


    propActions = [linkStoreKeeper] as PropAction[];

    disconnectedCallback(){
        if(this._storeKeeper) this._storeKeeper.forget();
    }

    connectedCallback(){
        this.style.display = 'none';
        super.connectedCallback();
        this.onPropsChange('disabled');
    }

}