import { XtalStateBase } from './xtal-state-base.js';
import { history_state_update } from './xtal-state-api.js';
import { define } from "./node_modules/xtal-latx/define.js";
var watch = 'watch';
var all = 'all';
var xtal_subscribers = 'xtal-subscribers';
var popstate = 'popstate'; //const once = 'once';

function remove(array, element) {
  var index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

export var XtalStateWatch =
/*#__PURE__*/
function (_XtalStateBase) {
  babelHelpers.inherits(XtalStateWatch, _XtalStateBase);

  function XtalStateWatch() {
    babelHelpers.classCallCheck(this, XtalStateWatch);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateWatch).apply(this, arguments));
  }

  babelHelpers.createClass(XtalStateWatch, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, nv) {
      babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateWatch.prototype), "attributeChangedCallback", this).call(this, name, oldValue, nv);

      switch (name) {
        case watch:
          this._watch = nv === '' ? all : popstate;
          break;
      }

      this.notify();
    }
  }, {
    key: "pushReplaceHandler",
    value: function pushReplaceHandler(e) {
      var win = this._window;
      var detail = e.detail; //if(detail.newState && win.__xtalStateInfo.startedAsNull && !win.__xtalStateInfo.hasStarted){

      if (detail.initVal) {
        //win.__xtalStateInfo.hasStarted;
        this.dataset.historyInit = 'true';
        this.dataset.popstate = 'true';
      } else {
        delete this.dataset.popstate;
        delete this.dataset.historyInit;
      }

      this.history = this._window.history.state;
    }
  }, {
    key: "popStateHandler",
    value: function popStateHandler(e) {
      this.dataset.popstate = 'true';
      this.history = this._window.history.state;
    }
  }, {
    key: "addSubscribers",
    value: function addSubscribers() {
      var _this = this;

      if (this._notReady) {
        setTimeout(function () {
          _this.addSubscribers();
        }, 50);
        return;
      }

      switch (this._watch) {
        case all:
        case popstate:
          if (!this._boundPushReplaceListener) {
            this._boundPushReplaceListener = this.pushReplaceHandler.bind(this);

            this._window.addEventListener(history_state_update, this._boundPushReplaceListener);
          }

      }

      switch (this._watch) {
        case popstate:
          if (!this._boundPopStateListener) {
            this._boundPopStateListener = this.popStateHandler.bind(this);

            this._window.addEventListener(popstate, this._boundPopStateListener);
          }

      }

      this._connected = true;
      this.history = this._window.history.state; //this.notify();
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      //this._connected = true;
      this._upgradeProperties([watch]);

      babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateWatch.prototype), "connectedCallback", this).call(this);
      this.addSubscribers();
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this._boundPopStateListener) this.removeEventListener(popstate, this._boundPopStateListener);
      if (this._boundPushReplaceListener) this.removeEventListener(history_state_update, this._boundPushReplaceListener);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.disconnect();
    }
  }, {
    key: "notify",
    value: function notify() {
      if (!this._watch || this._disabled || !this._connected || this._history === undefined || this._history === null) return;
      this.de('history', {
        value: this._history
      });
    }
  }, {
    key: "history",
    get: function get() {
      return this._history;
    },
    set: function set(newVal) {
      this._history = newVal;
      if (this._watch) this.notify();
    }
  }, {
    key: "watch",
    get: function get() {
      return this._watch;
    },
    set: function set(nv) {
      this.attr(watch, nv);
    }
  }], [{
    key: "is",
    get: function get() {
      return 'xtal-state-watch';
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateWatch), "observedAttributes", this).concat([watch]);
    }
  }]);
  return XtalStateWatch;
}(XtalStateBase);
define(XtalStateWatch); //# sourceMappingURL=xtal-state-watch.js.map