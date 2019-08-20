import { XtalStateBase } from "./xtal-state-base.js";
import { history_state_update, init } from "./xtal-state-api.js";
export class XtalStateWatch extends XtalStateBase {
    constructor() {
        super(...arguments);
        this._addedEventHandlers = false;
    }
    static get is() {
        return "xtal-state-watch";
    }
    get state() {
        if (this._win === undefined)
            return undefined;
        return this._win.history.state;
    }
    onPropsChange() {
        if (!super.onPropsChange())
            return false;
        if (!this._addedEventHandlers) {
            this._addedEventHandlers = true;
            if (this._storeKeeper) {
                this._storeKeeper.getContextWindow().then(win => {
                    this._win = win;
                    this.addEventHandlers(win);
                });
            }
            else {
                this._win = window;
                this.addEventHandlers(window);
            }
        }
    }
    stateChangeHandler(e) {
        const detail = e.detail;
        if (detail.initVal) {
            //win.__xtalStateInfo.hasStarted;
            this.dataset.historyInit = "true";
            this.dataset.popstate = "true";
        }
        else {
            delete this.dataset.popstate;
            delete this.dataset.historyInit;
        }
        this.notify();
    }
    popStateHandler(e) {
        this.dataset.popstate = "true";
        this.notify();
    }
    addEventHandlers(win) {
        const info = init(win);
        this._stateChangeHandler = this.stateChangeHandler.bind(this);
        win.addEventListener(history_state_update, this._stateChangeHandler);
        this._popStateHandler = this.popStateHandler.bind(this);
        win.addEventListener("popstate", this._popStateHandler);
    }
    disconnectedCallback() {
        if (this._win) {
            if (this._stateChangeHandler) {
                this._win.removeEventListener(history_state_update, this._stateChangeHandler);
            }
            if (this._popStateHandler) {
                this._win.removeEventListener('popstate', this._popStateHandler);
            }
        }
    }
    notify() {
        if (this._disabled || !this._conn)
            return;
        const state = this.state;
        this.de("state", {
            value: state
        });
    }
}
