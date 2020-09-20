import { XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { StoreKeeper } from './StoreKeeper.js';
export const linkStoreKeeper = ({ guid, self }) => {
    if (guid !== undefined) {
        self._storeKeeper = new StoreKeeper(guid);
    }
};
export class XtalStateBase extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this.propActions = [linkStoreKeeper];
    }
    disconnectedCallback() {
        if (this._storeKeeper)
            this._storeKeeper.forget();
    }
    connectedCallback() {
        this.style.display = 'none';
        super.connectedCallback();
        this.onPropsChange('disabled');
    }
}
