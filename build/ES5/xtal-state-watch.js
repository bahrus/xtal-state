import { XtalStateBase } from './xtal-state-base.js';
import { define } from "./node_modules/xtal-latx/define.js";
var watch = 'watch';
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
  babelHelpers.createClass(XtalStateWatch, null, [{
    key: "is",
    get: function get() {
      return 'xtal-state-watch';
    }
  }]);

  function XtalStateWatch() {
    babelHelpers.classCallCheck(this, XtalStateWatch);
    return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateWatch).call(this));
  }

  babelHelpers.createClass(XtalStateWatch, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, nv) {
      babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateWatch.prototype), "attributeChangedCallback", this).call(this, name, oldValue, nv);

      switch (name) {
        case watch:
          this._watch = nv === '' ? 'all' : popstate;
          break;
      }

      this.notify();
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

      var win = this._window;

      if (!win[xtal_subscribers]) {
        win[xtal_subscribers] = [];
        var originalPushState = win.history.pushState;
        var boundPushState = originalPushState.bind(win.history);

        win.history.pushState = function (newState, title, URL) {
          boundPushState(newState, title, URL);
          win[xtal_subscribers].forEach(function (subscriber) {
            delete subscriber.dataset.popstate;
            subscriber.history = newState;
          });
        };

        var originalReplaceState = win.history.replaceState;
        var boundReplaceState = originalReplaceState.bind(win.history);

        win.history.replaceState = function (newState, title, URL) {
          boundReplaceState(newState, title, URL);
          win[xtal_subscribers].forEach(function (subscriber) {
            delete subscriber.dataset.popstate;
            subscriber.history = newState;
          });
        };

        win.addEventListener(popstate, function (e) {
          win[xtal_subscribers].forEach(function (subscriber) {
            subscriber.dataset.popstate = 'true';
            subscriber.history = win.history.state;
          });
        });
      }

      this._window[xtal_subscribers].push(this);

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
      if (this._window) {
        var subs = this._window[xtal_subscribers];
        if (subs) remove(subs, this);
      }
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
      var ds = this.dataset;
      var doIt = false;

      switch (this._watch) {
        case 'all':
          doIt = true;
          break;

        case popstate:
          doIt = !ds.historyChanged || ds.popstate === 'true';
          break;
      }

      if (!doIt) return;
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
    key: "observedAttributes",
    get: function get() {
      return babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateWatch), "observedAttributes", this).concat([watch]);
    }
  }]);
  return XtalStateWatch;
}(XtalStateBase);
define(XtalStateWatch); //# sourceMappingURL=xtal-state-watch.js.map