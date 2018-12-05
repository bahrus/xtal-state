import { XtalStateBase } from './xtal-state-base.js';
import { WithPath, with_path } from "./node_modules/xtal-latx/with-path.js";
import { UrlFormatter } from './url-formatter.js';
import { define } from "./node_modules/xtal-latx/define.js";
import { debounce } from "./node_modules/xtal-latx/debounce.js";
var make = 'make';
var rewrite = 'rewrite';
var history$ = 'history'; //const wherePath = 'where-path';

var title = 'title';
var new$$ = 'new';
/**
 * `xtal-state-commit`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

export var XtalStateCommit =
/*#__PURE__*/
function (_UrlFormatter) {
  babelHelpers.inherits(XtalStateCommit, _UrlFormatter);

  function XtalStateCommit() {
    var _this;

    babelHelpers.classCallCheck(this, XtalStateCommit);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateCommit).apply(this, arguments));
    _this._title = '';
    return _this;
  }

  babelHelpers.createClass(XtalStateCommit, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(n, ov, nv) {
      switch (n) {
        case new$$:
        case rewrite:
        case make:
          this['_' + n] = nv !== null;
          break;

        case title:
          this['_' + n] = nv;
          break;

        case with_path:
          this._withPath = nv;
          break;
      }

      babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateCommit.prototype), "attributeChangedCallback", this).call(this, n, ov, nv); //this.onPropsChange();
    } //_connected!: boolean;

  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;

      this._upgradeProperties([make, rewrite, title, 'withPath', 'stringifyFn', new$$, 'syncHistory'].concat([history$]));

      this._debouncer = debounce(function () {
        _this2.updateHistory();
      }, 50); //this._connected = true;

      babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateCommit.prototype), "connectedCallback", this).call(this);
    }
  }, {
    key: "onPropsChange",
    value: function onPropsChange() {
      var _this3 = this;

      if (this._disabled) return;

      if (babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateCommit.prototype), "onPropsChange", this).call(this)) {
        if (this._notReady) {
          setTimeout(function () {
            _this3.onPropsChange();
          }, 50);
          return;
        }

        return true;
      }

      if (!this._make && !this._rewrite) return true;

      this._debouncer();
    }
  }, {
    key: "mergedHistory",
    value: function mergedHistory() {
      if (this._history === undefined) return undefined;
      return this.wrap(this._history);
    }
  }, {
    key: "updateHistory",
    value: function updateHistory() {
      var hist = this._new ? {} : this.mergedHistory();
      if (hist === null || hist === undefined) return;
      var method = this.make ? 'push' : 'replace'; //const bH = this._window.history;
      //if(compare(bH.state, hist)) return;

      this.value = hist;
      this._disabled = true;
      this.de('history', {
        value: hist
      });
      this._disabled = false;
      if (this.make && !this.url) return;
      var url = this._url;

      if (!url || this._new) {
        if (!this._replaceUrlValue || this._new) {
          url = this._window.location.href;
        }
      }

      if (!url) return null;
      url = this.adjustUrl(url);
      if (url === null) return;

      this._window.history[method + 'State'](hist, this._title, url);
    }
  }, {
    key: "make",

    /**
     * PushState in history
     */
    get: function get() {
      return this._make;
    },
    set: function set(val) {
      this.attr(make, val, '');
    }
    /**
     * ReplaceState in history
     */

  }, {
    key: "rewrite",
    get: function get() {
      return this._rewrite;
    },
    set: function set(val) {
      this.attr(rewrite, val, '');
    }
    /**
     * Window Context History Object
     */

  }, {
    key: "history",
    get: function get() {
      return this._window.history.state;
    },
    set: function set(newVal) {
      this._history = newVal;
      this.onPropsChange();
    }
    /**
     * Title to use when calling push/replace state
     */

  }, {
    key: "title",
    get: function get() {
      return this._title;
    },
    set: function set(val) {
      this.attr(title, val);
    }
  }, {
    key: "new",
    get: function get() {
      return this._new;
    },
    set: function set(v) {
      this.attr(new$$, v, '');
    }
  }], [{
    key: "is",
    get: function get() {
      return 'xtal-state-commit';
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateCommit), "observedAttributes", this).concat(babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateCommit), "UFAttribs", this)).concat([make, rewrite, title, with_path, new$$]);
    }
  }]);
  return XtalStateCommit;
}(UrlFormatter(WithPath(XtalStateBase)));
define(XtalStateCommit); //# sourceMappingURL=xtal-state-commit.js.map