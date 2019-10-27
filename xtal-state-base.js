import { XtallatX } from 'xtal-element/xtal-latx.js';
import { hydrate } from 'trans-render/hydrate.js';
import { StoreKeeper } from './StoreKeeper.js';
const guid = 'guid';
export class XtalStateBase extends XtallatX(hydrate(HTMLElement)) {
    get guid() {
        return this._guid;
    }
    /**
     *
     */
    set guid(val) {
        this.attr(guid, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([guid]);
    }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch (name) {
            case guid:
                if (this._guid !== undefined)
                    return;
                this._guid = newVal;
                this._storeKeeper = new StoreKeeper(this._guid);
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.style.display = 'none';
        this.propUp(['disabled', guid]);
        this._conn = true;
        this.onPropsChange();
    }
    disconnectedCallback() {
        if (this._storeKeeper)
            this._storeKeeper.forget();
    }
    onPropsChange() {
        return (this._conn && !this.disabled);
    }
}
