import { XtalStateBase } from "./xtal-state-base.js";
import { history_state_update, init } from "./xtal-state-api.js";
import { define, de } from "xtal-element/xtal-latx.js";
export const addEventHandlers = ({ self }) => {
    if (!self._addedEventHandlers) {
        self._addedEventHandlers = true;
        if (self._storeKeeper) {
            self._storeKeeper.getContextWindow().then(win => {
                self._win = win;
                self.addEventHandlers(win);
            });
        }
        else {
            self._win = window;
            self.addEventHandlers(window);
        }
    }
};
/**
 * Watch for history.state changes
 * @element xtal-state-watch
 * @event history-changed
 */
export class XtalStateWatch extends XtalStateBase {
    constructor() {
        super(...arguments);
        this._addedEventHandlers = false;
        this._initialEvent = true;
    }
    get history() {
        if (this._win === undefined)
            return undefined;
        return this._win.history;
    }
    stateChangeHandler(e) {
        const detail = e.detail;
        let isPopstate = false;
        if (detail.initVal) {
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
    connectedCallback() {
        super.connectedCallback();
        addEventHandlers(this);
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
        if (this.disabled || !this._xlConnected)
            return;
        if (this._initialEvent) {
            this.dataset.initialEvent = "true";
        }
        else {
            delete this.dataset.initialEvent;
        }
        this[de]("history", {
            value: this.history.state,
            isInitialEvent: this._initialEvent,
            isPopstate: isPopstate,
        });
        this._initialEvent = false;
    }
}
/**
 * @private
 */
XtalStateWatch.is = "xtal-state-watch";
define(XtalStateWatch);
