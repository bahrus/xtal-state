import { XtalStateBase } from "./xtal-state-base.js";
import { history_state_update, init } from "./xtal-state-api.js";
import {define} from "xtal-element/xtal-latx.js";
import {PropAction} from 'xtal-element/types.d.js';
/**
 * Watch for history.state changes
 * @element xtal-state-watch
 * @event history-changed
 */
export class XtalStateWatch extends XtalStateBase {

  static is = "xtal-state-watch";
  
  _addedEventHandlers = false;
  _win: Window | undefined;
  get history() {
    if (this._win === undefined) return undefined;
    return this._win.history;
  }
  propActions = this.propActions.concat([
    ({disabled, self} : XtalStateWatch) =>{
      if (!self._addedEventHandlers) {
        self._addedEventHandlers = true;
        if (self._storeKeeper) {
          self._storeKeeper.getContextWindow().then(win => {
            self._win = win;
            self.addEventHandlers(win);
          });
        } else {
          self._win = window;
          self.addEventHandlers(window);
        }
      }
    }
] as PropAction[]);
  onPropsChange(name: string) {
    super.onPropsChange(name);

  }
  _stateChangeHandler;
  stateChangeHandler(e: CustomEventInit) {
    const detail = e.detail;
    let isPopstate = false;
    if (detail.initVal) {
      //win.__xtalStateInfo.hasStarted;
      this.dataset.historyInit = "true";
      this.dataset.popstate = "true";
      isPopstate = true;
    } else {
      delete this.dataset.popstate;
      delete this.dataset.historyInit;
    }
    this.notify(isPopstate);
  }
  _popStateHandler;
  popStateHandler(e: Event) {
    this.dataset.popstate = "true";
    this.notify(true);
  }

  addEventHandlers(win: Window) {
    const info = init(win);
    this._stateChangeHandler = this.stateChangeHandler.bind(this);
    win.addEventListener(history_state_update, this._stateChangeHandler);
    this._popStateHandler = this.popStateHandler.bind(this);
    win.addEventListener("popstate", this._popStateHandler);
    if(win.history.state !== null){
      this.notify(false);
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
  _initialEvent = true;
  notify(isPopstate: boolean) {
    if (this._disabled || !this._connected) return;
    if(this._initialEvent){
      this.dataset.initialEvent = "true";
    }else{
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
