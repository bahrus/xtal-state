//@ts-check
(function () {
  function define(custEl) {
    var tagName = custEl.is;

    if (customElements.get(tagName)) {
      console.warn('Already registered ' + tagName);
      return;
    }

    customElements.define(tagName, custEl);
  }

  var disabled = 'disabled';
  /**
   * Base class for many xtal- components
   * @param superClass
   */

  function XtallatX(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass) {
        babelHelpers.inherits(_class, _superClass);

        function _class() {
          var _this;

          babelHelpers.classCallCheck(this, _class);
          _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class).apply(this, arguments));
          _this._evCount = {};
          return _this;
        }

        babelHelpers.createClass(_class, [{
          key: "attr",

          /**
           * Set attribute value.
           * @param name
           * @param val
           * @param trueVal String to set attribute if true.
           */
          value: function attr(name, val, trueVal) {
            var v = val ? 'set' : 'remove'; //verb

            this[v + 'Attribute'](name, trueVal || val);
          }
          /**
           * Turn number into string with even and odd values easy to query via css.
           * @param n
           */

        }, {
          key: "to$",
          value: function to$(n) {
            var mod = n % 2;
            return (n - mod) / 2 + '-' + mod;
          }
          /**
           * Increment event count
           * @param name
           */

        }, {
          key: "incAttr",
          value: function incAttr(name) {
            var ec = this._evCount;

            if (name in ec) {
              ec[name]++;
            } else {
              ec[name] = 0;
            }

            this.attr('data-' + name, this.to$(ec[name]));
          }
        }, {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
              case disabled:
                this._disabled = newVal !== null;
                break;
            }
          }
          /**
           * Dispatch Custom Event
           * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
           * @param detail Information to be passed with the event
           * @param asIs If true, don't append event name with '-changed'
           */

        }, {
          key: "de",
          value: function de(name, detail) {
            var asIs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var eventName = name + (asIs ? '' : '-changed');
            var newEvent = new CustomEvent(eventName, {
              detail: detail,
              bubbles: true,
              composed: false
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
          }
          /**
           * Needed for asynchronous loading
           * @param props Array of property names to "upgrade", without losing value set while element was Unknown
           */

        }, {
          key: "_upgradeProperties",
          value: function _upgradeProperties(props) {
            var _this2 = this;

            props.forEach(function (prop) {
              if (_this2.hasOwnProperty(prop)) {
                var value = _this2[prop];
                delete _this2[prop];
                _this2[prop] = value;
              }
            });
          }
        }, {
          key: "disabled",

          /**
           * Any component that emits events should not do so if it is disabled.
           * Note that this is not enforced, but the disabled property is made available.
           * Users of this mix-in should ensure not to call "de" if this property is set to true.
           */
          get: function get() {
            return this._disabled;
          },
          set: function set(val) {
            this.attr(disabled, val, '');
          }
        }], [{
          key: "observedAttributes",
          get: function get() {
            return [disabled];
          }
        }]);
        return _class;
      }(superClass)
    );
  }

  function getHost(el) {
    var parent = el;

    while (parent = parent.parentNode) {
      if (parent.nodeType === 11) {
        return parent['host'];
      } else if (parent.tagName === 'BODY') {
        return null;
      }
    }

    return null;
  }

  var history_state_update = 'history-state-update';
  /**
   *
   * @param par Parent or document fragment which should mantain regional state
   * @param _t XtalStateBase element
   */

  function getIFrmWin(par, callBack) {
    var ifr = par.querySelector('iframe[xtal-state]');

    if (ifr === null) {
      ifr = document.createElement('iframe'); //ifr.src = 'about:blank';

      ifr.setAttribute('xtal-state', '');
      ifr.addEventListener('load', function () {
        ifr.setAttribute('loaded', '');
        if (callBack !== null) callBack(ifr);
      });
      ifr.src = 'blank.html';
      ifr.style.display = 'none';
      par.appendChild(ifr);
    } else {
      if (!ifr.hasAttribute('loaded')) {
        ifr.addEventListener('load', function () {
          if (callBack !== null) callBack(ifr);
        });
      } else {
        if (callBack !== null) callBack(ifr);
      }
    }

    return ifr.contentWindow;
  }

  function getMchPar(el, level) {
    var test = el.parentElement;

    while (test) {
      if (test.matches(level)) return test;
      test = test.parentElement;
    }
  }

  function getSC(el) {
    var test = getHost(el);
    return test.shadowRoot === null ? test : test.shadowRoot;
  }

  function getWinCtx(el, level) {
    var _t = this;

    return new Promise(function (resolve, reject) {
      switch (level) {
        case "global":
          init(self);
          resolve(self);
          break;

        case "local":
          getIFrmWin(el.parentElement, function (ifrm) {
            init(ifrm.contentWindow);
            resolve(ifrm.contentWindow);
          });
          break;

        case "shadow":
          getIFrmWin(getSC(el), function (ifrm) {
            init(ifrm.contentWindow);
            resolve(ifrm.contentWindow);
          });
          break;

        default:
          getIFrmWin(getMchPar(el, level), function (ifrm) {
            init(ifrm.contentWindow);
            resolve(ifrm.contentWindow);
          });
      }
    });
  }

  function de(oldState, win) {
    var detail = {
      oldState: oldState,
      newState: win.history.state,
      initVal: false
    };
    var historyInfo = win.__xtalStateInfo;

    if (!historyInfo.hasStarted) {
      historyInfo.hasStarted = true;

      if (historyInfo.startedAsNull) {
        detail.initVal = true;
      }
    }

    var newEvent = new CustomEvent(history_state_update, {
      detail: detail,
      bubbles: true,
      composed: true
    });
    win.dispatchEvent(newEvent);
  }

  function init(win) {
    if (win.__xtalStateInit) return;
    win.__xtalStateInit = true;

    if (!win.__xtalStateInfo) {
      win.__xtalStateInfo = {
        startedAsNull: win.history.state === null
      };
    }

    var originalPushState = win.history.pushState;
    var boundPushState = originalPushState.bind(win.history);

    win.history.pushState = function (newState, title, URL) {
      var oldState = win.history.state;
      boundPushState(newState, title, URL);
      de(oldState, win);
    };

    var originalReplaceState = win.history.replaceState;
    var boundReplaceState = originalReplaceState.bind(win.history);

    win.history.replaceState = function (newState, title, URL) {
      var oldState = win.history.state;
      boundReplaceState(newState, title, URL);
      de(oldState, win);
    };
  }

  var level = 'level';

  var XtalStateBase =
  /*#__PURE__*/
  function (_XtallatX) {
    babelHelpers.inherits(XtalStateBase, _XtallatX);

    function XtalStateBase() {
      var _this3;

      babelHelpers.classCallCheck(this, XtalStateBase);
      _this3 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateBase).apply(this, arguments));
      _this3._level = 'global';
      return _this3;
    }

    babelHelpers.createClass(XtalStateBase, [{
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name, oldVal, newVal) {
        babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateBase.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);

        switch (name) {
          case level:
            this._level = newVal;
            break;
        }

        this.onPropsChange();
      }
    }, {
      key: "connectedCallback",
      value: function connectedCallback() {
        this.style.display = 'none';

        this._upgradeProperties(['disabled', level]);

        this._conn = true;
        this.onPropsChange();
      }
    }, {
      key: "onPropsChange",
      value: function onPropsChange() {
        var _this4 = this;

        if (!this._conn || this._disabled) return true;

        if (!this._window) {
          this._notReady = true;
          getWinCtx(this, this._level).then(function (win) {
            _this4._window = win;
            _this4._notReady = false;
          });
        }

        if (this._notReady) return true;
      }
    }, {
      key: "level",
      get: function get() {
        return this._level;
      },
      set: function set(val) {
        this.attr(level, val);
      }
    }, {
      key: "window",
      get: function get() {
        return this._window;
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateBase), "observedAttributes", this).concat([level]);
      }
    }]);
    return XtalStateBase;
  }(XtallatX(HTMLElement));

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

  var XtalStateWatch =
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
        var _this5 = this;

        if (this._notReady) {
          setTimeout(function () {
            _this5.addSubscribers();
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

  define(XtalStateWatch);
  var with_url_pattern = 'with-url-pattern';
  var parse = 'parse';
  var init_history_if_null = 'init-history-if-null';

  var XtalStateParse =
  /*#__PURE__*/
  function (_XtalStateBase2) {
    babelHelpers.inherits(XtalStateParse, _XtalStateBase2);

    function XtalStateParse() {
      var _this6;

      babelHelpers.classCallCheck(this, XtalStateParse);
      _this6 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateParse).apply(this, arguments));
      _this6._checkedNull = false;
      return _this6;
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
        var _this7 = this;

        if (this._disabled || this.value || this.noMatch) return;

        if (!this._window) {
          setTimeout(function () {
            _this7.onParsePropsChange();
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

  define(XtalStateParse);

  var debounce = function debounce(fn, time) {
    var timeout;
    return function () {
      var _this8 = this,
          _arguments = arguments;

      var functionCall = function functionCall() {
        return fn.apply(_this8, _arguments);
      };

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };

  function createNestedProp(target, pathTokens, val, clone) {
    var firstToken = pathTokens.shift();
    var tft = target[firstToken];
    var returnObj = babelHelpers.defineProperty({}, firstToken, tft ? tft : {});
    var tc = returnObj[firstToken]; //targetContext

    var lastToken = pathTokens.pop();
    pathTokens.forEach(function (token) {
      var newContext = tc[token];

      if (!newContext) {
        newContext = tc[token] = {};
      }

      tc = newContext;
    });

    if (tc[lastToken] && babelHelpers.typeof(val) === 'object') {
      Object.assign(tc[lastToken], val);
    } else {
      if (lastToken === undefined) {
        returnObj[firstToken] = val;
      } else {
        tc[lastToken] = val;
      }
    } //this controversial line is to force the target to see new properties, even though we are updating nested properties.
    //In some scenarios, this will fail (like if updating element.dataset), but hopefully it's okay to ignore such failures 


    if (clone) try {
      Object.assign(target, returnObj);
    } catch (e) {}
    ;
  }

  var with_path = 'with-path';
  /**
   * Custom Element mixin that allows a property to be namespaced
   * @param superClass
   */

  function WithPath(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass2) {
        babelHelpers.inherits(_class2, _superClass2);

        function _class2() {
          babelHelpers.classCallCheck(this, _class2);
          return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class2).apply(this, arguments));
        }

        babelHelpers.createClass(_class2, [{
          key: "wrap",
          value: function wrap(obj) {
            if (this._withPath) {
              var mergedObj = {};
              createNestedProp(mergedObj, this._withPath.split('.'), obj, true);
              return mergedObj; // const retObj = mergedObj;
              // const splitPath = this._withPath.split('.');
              // const lenMinus1 = splitPath.length - 1;
              // splitPath.forEach((pathToken, idx) => {
              //     if(idx === lenMinus1){
              //         mergedObj[pathToken] = obj;
              //     }else{
              //         mergedObj = mergedObj[pathToken] = {};
              //     }
              // })
              // return retObj;
            } else {
              return obj;
            }
          }
        }, {
          key: "withPath",

          /**
          * @type {string}
          * object inside a new empty object, with key equal to this value.
          * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
          * and with-path = 'myPath'
          * then the source object which be merged into is:
          * {myPath: {foo: 'hello', bar: 'world'}}
          */
          get: function get() {
            return this._withPath;
          },
          set: function set(val) {
            this.setAttribute(with_path, val);
          }
        }]);
        return _class2;
      }(superClass)
    );
  }
  /**
   * Deep merge two objects.
   * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
   * @param target
   * @param source
   *
   */


  function mergeDeep(target, source) {
    if (babelHelpers.typeof(target) !== 'object') return;
    if (babelHelpers.typeof(source) !== 'object') return;

    for (var key in source) {
      var sourceVal = source[key];
      var targetVal = target[key];
      if (!sourceVal) continue; //TODO:  null out property?

      if (!targetVal) {
        target[key] = sourceVal;
        continue;
      }

      switch (babelHelpers.typeof(sourceVal)) {
        case 'object':
          switch (babelHelpers.typeof(targetVal)) {
            case 'object':
              mergeDeep(targetVal, sourceVal);
              break;

            default:
              //console.log(key);
              target[key] = sourceVal;
              break;
          }

          break;

        default:
          target[key] = sourceVal;
      }
    }

    return target;
  }

  var url = 'url';
  var url_search = 'url-search';
  var replace_url_value = 'replace-url-value';

  function UrlFormatter(superClass) {
    return (
      /*#__PURE__*/
      function (_superClass3) {
        babelHelpers.inherits(_class3, _superClass3);

        function _class3() {
          babelHelpers.classCallCheck(this, _class3);
          return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(_class3).apply(this, arguments));
        }

        babelHelpers.createClass(_class3, [{
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(n, ov, nv) {
            switch (n) {
              case url:
                this['_' + n] = nv;
                break;

              case url_search:
                this._urlSearch = nv;
                break;

              case replace_url_value:
                this._replaceUrlValue = nv;
                break;
            }

            if (babelHelpers.get(babelHelpers.getPrototypeOf(_class3.prototype), "attributeChangedCallback", this)) babelHelpers.get(babelHelpers.getPrototypeOf(_class3.prototype), "attributeChangedCallback", this).call(this, n, ov, nv);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            this._upgradeProperties([url, 'urlSearch', 'replaceUrlValue', 'stringifyFn']);

            if (babelHelpers.get(babelHelpers.getPrototypeOf(_class3.prototype), "connectedCallback", this)) babelHelpers.get(babelHelpers.getPrototypeOf(_class3.prototype), "connectedCallback", this).call(this);
          }
        }, {
          key: "adjustUrl",
          value: function adjustUrl(url) {
            if (this._stringifyFn) {
              url = this._stringifyFn(this);
            } else if (this._replaceUrlValue && this._urlSearch) {
              var reg = new RegExp(this._urlSearch);
              url = url.replace(reg, this._replaceUrlValue);
            }

            return url;
          }
        }, {
          key: "url",

          /**
           * URL to use when calling push/replace state
           */
          get: function get() {
            return this._url;
          },
          set: function set(val) {
            this.attr(url, val);
          }
          /**
           * Regular expression to search url for.
           */

        }, {
          key: "urlSearch",
          get: function get() {
            return this._urlSearch;
          },
          set: function set(val) {
            this.attr(url_search, val);
          }
          /**
           * Replace URL expression, coupled with urlSearch
           */

        }, {
          key: "replaceUrlValue",
          get: function get() {
            return this._replaceUrlValue;
          },
          set: function set(val) {
            this.attr(replace_url_value, val);
          }
        }, {
          key: "stringifyFn",
          get: function get() {
            return this._stringifyFn;
          },
          set: function set(nv) {
            this._stringifyFn = nv;
          }
        }], [{
          key: "UFAttribs",
          get: function get() {
            return [url, url_search, replace_url_value];
          }
        }]);
        return _class3;
      }(superClass)
    );
  }

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

  var XtalStateCommit =
  /*#__PURE__*/
  function (_UrlFormatter) {
    babelHelpers.inherits(XtalStateCommit, _UrlFormatter);

    function XtalStateCommit() {
      var _this9;

      babelHelpers.classCallCheck(this, XtalStateCommit);
      _this9 = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateCommit).apply(this, arguments));
      _this9._title = '';
      return _this9;
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
        var _this10 = this;

        this._upgradeProperties([make, rewrite, title, 'withPath', 'stringifyFn', new$$, 'syncHistory'].concat([history$]));

        this._debouncer = debounce(function () {
          _this10.updateHistory();
        }, 50); //this._connected = true;

        babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateCommit.prototype), "connectedCallback", this).call(this);
      }
    }, {
      key: "onPropsChange",
      value: function onPropsChange() {
        var _this11 = this;

        if (this._disabled) return;

        if (babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateCommit.prototype), "onPropsChange", this).call(this)) {
          if (this._notReady) {
            setTimeout(function () {
              _this11.onPropsChange();
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

  define(XtalStateCommit);

  var XtalStateUpdate =
  /*#__PURE__*/
  function (_XtalStateCommit) {
    babelHelpers.inherits(XtalStateUpdate, _XtalStateCommit);

    function XtalStateUpdate() {
      babelHelpers.classCallCheck(this, XtalStateUpdate);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(XtalStateUpdate).apply(this, arguments));
    }

    babelHelpers.createClass(XtalStateUpdate, [{
      key: "mergedHistory",
      value: function mergedHistory() {
        var sm = babelHelpers.get(babelHelpers.getPrototypeOf(XtalStateUpdate.prototype), "mergedHistory", this).call(this);
        if (sm === undefined) return undefined;
        if (this._window.history.state === null) return sm;
        var retObj = Object.assign({}, this._window.history.state);
        return mergeDeep(retObj, this.wrap(this._history));
      }
    }], [{
      key: "is",
      get: function get() {
        return 'xtal-state-update';
      }
    }]);
    return XtalStateUpdate;
  }(XtalStateCommit);

  define(XtalStateUpdate);
})();