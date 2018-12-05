import { XtalStateCommit } from './xtal-state-commit.js';
import { define } from "./node_modules/xtal-latx/define.js";
import { mergeDeep } from "./node_modules/xtal-latx/mergeDeep.js";
export var XtalStateUpdate =
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
define(XtalStateUpdate); //# sourceMappingURL=xtal-state-update.js.map