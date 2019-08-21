import { XtalStateBase } from "./xtal-state-base.js";
import { history_state_update, init } from "./xtal-state-api.js";
import {define} from "trans-render/define.js";
export class XtalStateWatch extends XtalStateBase {
  static get is() {
    return "xtal-state-watch";
  }
  _addedEventHandlers = false;
  _win: Window | undefined;
  get history() {
    if (this._win === undefined) return undefined;
    return this._win.history;
  }
  onPropsChange() {
    if (!super.onPropsChange()) return false;
    if (!this._addedEventHandlers) {
      this._addedEventHandlers = true;
      if (this._storeKeeper) {
        this._storeKeeper.getContextWindow().then(win => {
          this._win = win;
          this.addEventHandlers(win);
        });
      } else {
        this._win = window;
        this.addEventHandlers(window);
      }
    }
  }
  _stateChangeHandler;
  stateChangeHandler(e: CustomEventInit) {
    const detail = e.detail;
    if (detail.initVal) {
      //win.__xtalStateInfo.hasStarted;
      this.dataset.historyInit = "true";
      this.dataset.popstate = "true";
    } else {
      delete this.dataset.popstate;
      delete this.dataset.historyInit;
    }
    this.notify();
  }
  _popStateHandler;
  popStateHandler(e: Event) {
    this.dataset.popstate = "true";
    this.notify();
  }

  addEventHandlers(win: Window) {
    const info = init(win);
    this._stateChangeHandler = this.stateChangeHandler.bind(this);
    win.addEventListener(history_state_update, this._stateChangeHandler);
    this._popStateHandler = this.popStateHandler.bind(this);
    win.addEventListener("popstate", this._popStateHandler);
    if(win.history.state !== null){
      this.notify();
    }
  }

  disconnectedCallback() {
    if (this._win) {
      if (this._stateChangeHandler) {
        this._win.removeEventListener(
          history_state_update,
          this._stateChangeHandler
        );
      }
      if(this._popStateHandler){
          this._win.removeEventListener('popstate', this._popStateHandler);
      }
    }
  }

  notify() {
    if (this._disabled || !this._conn) return;
    this.de("history", {
      value: this.history.state
    });
  }
}
define(XtalStateWatch);
