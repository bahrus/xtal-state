import { XtalStateBase } from "./xtal-state-base.js";
import { history_state_update, init } from "./xtal-state-api.js";
import { define } from "trans-render/define.js";
export class XtalStateWatch extends XtalStateBase {
    constructor() {
        super(...arguments);
        this._addedEventHandlers = false;
        this._initialEvent = true;
    }
    static get is() {
        return "xtal-state-watch";
    }
    get history() {
        if (this._win === undefined)
            return undefined;
        return this._win.history;
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
        let isPopstate = false;
        if (detail.initVal) {
            //win.__xtalStateInfo.hasStarted;
            this.dataset.historyInit = "true";
            this.dataset.popstate = "true";
            isPopstate = true;
        }
        else {
            delete this.dataset.popstate;
            delete this.dataset.historyInit;
        }
        this.notify(isPopstate);
    }
    popStateHandler(e) {
        this.dataset.popstate = "true";
        this.notify(true);
    }
    addEventHandlers(win) {
        const info = init(win);
        this._stateChangeHandler = this.stateChangeHandler.bind(this);
        win.addEventListener(history_state_update, this._stateChangeHandler);
        this._popStateHandler = this.popStateHandler.bind(this);
        win.addEventListener("popstate", this._popStateHandler);
        if (win.history.state !== null) {
            this.notify(false);
        }
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
    notify(isPopstate) {
        if (this._disabled || !this._conn)
            return;
        if (this._initialEvent) {
            this.dataset.initialEvent = "true";
        }
        else {
            delete this.dataset.initialEvent;
        }
        this.de("history", {
            value: this.history.state,
            isInitialEvent: this._initialEvent,
            isPopstate: isPopstate,
        });
        this._initialEvent = false;
    }
}
define(XtalStateWatch);
