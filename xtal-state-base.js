import { XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { StoreKeeper } from './StoreKeeper.js';
export class XtalStateBase extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super();
        this.propActions = [
            ({ guid, self }) => {
                if (guid !== undefined) {
                    self._storeKeeper = new StoreKeeper(guid);
                }
            }
        ];
    }
    disconnectedCallback() {
        if (this._storeKeeper)
            this._storeKeeper.forget();
    }
    connectedCallback() {
        super.connectedCallback();
        this.onPropsChange('disabled');
    }
}
