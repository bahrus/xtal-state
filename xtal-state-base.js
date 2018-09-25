import { XtallatX } from 'xtal-latx/xtal-latx.js';
import { getHost } from 'xtal-latx/getHost.js';
const level = 'level';
export class XtalStateBase extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._level = 'global';
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
                this._level = newVal;
                break;
        }
        this.onPropsChange();
    }
    connectedCallback() {
        this.style.display = 'none';
        this._upgradeProperties(['disabled', level]);
        this._conn = true;
        this.onPropsChange();
    }
    getWinObj(par) {
        let ifr = par.querySelector('iframe[xtal-state]');
        if (ifr === null) {
            ifr = document.createElement('iframe');
            //ifr.src = 'about:blank';
            ifr.setAttribute('xtal-state', '');
            this._notReady = true;
            ifr.addEventListener('load', () => {
                this._notReady = false;
                ifr.setAttribute('loaded', '');
            });
            ifr.src = 'blank.html';
            ifr.style.display = 'none';
            par.appendChild(ifr);
        }
        else {
            if (!ifr.hasAttribute('loaded')) {
                this._notReady = true;
                ifr.addEventListener('load', () => {
                    this._notReady = false;
                    //ifr.setAttribute('loaded', '');
                });
            }
        }
        return ifr.contentWindow;
    }
    onPropsChange() {
        if (!this._conn || this._disabled)
            return true;
        if (!this._window) {
            switch (this._level) {
                case "global":
                    this._window = self;
                    break;
                case "local":
                    this._window = this.getWinObj(this.parentElement);
                    break;
                case "shadow":
                    this._window = this.getWinObj(getHost(this));
                    break;
            }
        }
        if (this._notReady)
            return true;
    }
}
//# sourceMappingURL=xtal-state-base.js.map