import { XtallatX } from 'xtal-element/xtal-latx.js';
import { up, hydrate } from 'trans-render/hydrate.js';
import { getWinCtx } from './xtal-state-api.js';
const level = 'level';
export class XtalStateBase extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._notReady = true;
    }
    get level() {
        return this._level;
    }
    set level(val) {
        this.attr(level, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([level]);
    }
    get window() {
        return this._window;
    }
    attributeChangedCallback(name, oldVal, newVal) {
        super.attributeChangedCallback(name, oldVal, newVal);
        switch (name) {
            case level:
                if (this._level !== undefined)
                    throw "Change of level not allowed";
                this._level = newVal;
                getWinCtx(this, this._level).then((win) => {
                    this._window = win;
                    this._notReady = false;
                    this.onPropsChange();
                });
                break;
        }
        if (name !== level)
            this.onPropsChange();
    }
    connectedCallback() {
        this.style.display = 'none';
        this[up](['disabled', level]);
        this._conn = true;
        this.onPropsChange();
    }
    ;
    onPropsChange() {
        if (!this._conn || this._disabled || this._notReady || !this._window)
            return false;
        return true;
    }
}
