import { XtalStateBase } from './xtal-state-base.js';
import { define } from "./node_modules/xtal-latx/define.js";
var with_url_pattern = 'with-url-pattern';
var parse = 'parse';
var init_history_if_null = 'init-history-if-null';
export var XtalStateParse =
/*#__PURE__*/
function (_XtalStateBase) {
  babelHelpers.inherits(XtalStateParse, _XtalStateBase);

  function XtalStateParse() {
    var _this;

    babelHelpers.classCallCheck(this, XtalStateParse);
    _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateParse).apply(this, arguments));
    _this._checkedNull = false;
    return _this;
  }

  babelHelpers.createClass(XtalStateParse, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldVal, newVal) {
      babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateParse.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);

      switch (name) {
        case with_url_pattern:
          this._withURLPattern = newVal;
          break;

        case parse:
          this['_' + name] = newVal;
          break;

        default:
          babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateParse.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
          return;
      }

      this.onParsePropsChange();
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      this._upgradeProperties(['withURLPattern', parse, 'initHistoryIfNull', 'parseFn']);

      babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateParse.prototype), "connectedCallback", this).call(this);
      this.onParsePropsChange();
    }
  }, {
    key: "onPropsChange",
    value: function onPropsChange() {
      if (this._initHistoryIfNull) return false;
      return babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateParse.prototype), "onPropsChange", this).call(this);
    }
  }, {
    key: "onParsePropsChange",
    value: function onParsePropsChange() {
      var _this2 = this;

      if (this._disabled || this.value || this.noMatch) return;

      if (!this._window) {
        setTimeout(function () {
          _this2.onParsePropsChange();
        }, 50);
        return;
      }

      if (!this._checkedNull) {
        if (this._window.history.state === null) {
          this.dataset.historyWasNull = 'true';
        }

        this._checkedNull = true;
      }

      var value = null;

      if (this._withURLPattern) {
        value = XtalStateParse.parseAddressBar(this._parse, this._withURLPattern, this._window);

        if (value === -1) {
          if (!this._parseFn) return;
          var prseString = XtalStateParse.getObj(this._parse, this._window);
          value = this._parseFn(prseString, this);
        }
      }

      if (value === null) {
        this.noMatch = true;
        this.de('no-match-found', {
          value: true
        }, true);
        return;
      } else {
        this.value = value;
        this.de('match-found', {
          value: value
        }, true);
      }

      if (this._initHistoryIfNull && this._window.history.state !== null) this._window.history.replaceState(value, '', this._window.location.href);
    }
  }, {
    key: "withURLPattern",
    get: function get() {
      return this._withURLPattern;
    },
    set: function set(val) {
      this.attr(with_url_pattern, val);
    }
  }, {
    key: "parse",
    get: function get() {
      return this._parse;
    },
    set: function set(val) {
      this.attr(parse, val);
    }
  }, {
    key: "parseFn",
    get: function get() {
      return this._parseFn;
    },
    set: function set(nv) {
      this._parseFn = nv;
      this.onParsePropsChange();
    }
  }, {
    key: "initHistoryIfNull",
    get: function get() {
      return this._initHistoryIfNull;
    },
    set: function set(nv) {
      this.attr(init_history_if_null, nv, '');
    }
  }, {
    key: "noMatch",
    get: function get() {
      return this._noMatch;
    },
    set: function set(val) {
      this._noMatch = val;
      this.attr('no-match', val.toString());
    }
  }], [{
    key: "getObj",
    value: function getObj(parsePath, winObj) {
      var thingToParse = winObj;
      parsePath.split('.').forEach(function (token) {
        if (thingToParse) thingToParse = thingToParse[token];
      });
      return thingToParse;
    }
  }, {
    key: "parseAddressBar",
    value: function parseAddressBar(parsePath, urlPattern, winObj) {
      try {
        var reg = new RegExp(urlPattern);
        var thingToParse = this.getObj(parsePath, winObj);
        var parsed = reg.exec(thingToParse);
        if (!parsed) return null;
        return parsed['groups'];
      } catch (err) {
        return -1;
      }
    }
  }, {
    key: "is",
    get: function get() {
      return 'xtal-state-parse';
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateParse), "observedAttributes", this).concat([with_url_pattern, parse, init_history_if_null]);
    }
  }]);
  return XtalStateParse;
}(XtalStateBase);
define(XtalStateParse); //# sourceMappingURL=xtal-state-parse.js.map