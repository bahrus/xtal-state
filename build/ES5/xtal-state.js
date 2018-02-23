(function(){var a='set-state-and-push',b='set-state-and-replace',c='history-state-changed',d=function(d){function e(){return babelHelpers.classCallCheck(this,e),babelHelpers.possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return babelHelpers.inherits(e,d),babelHelpers.createClass(e,[{key:'broadastHistoryChange',value:function(a,b){var d=new CustomEvent(c,{detail:{value:a,fromPopEvent:b},bubbles:!0,composed:!0});this.dispatchEvent(d)}},{key:'onPropsChange',value:function(){if((this._push||this._replace)&&this.source){var a;switch(babelHelpers.typeof(this.source)){case'object':a=window.history.state?Object.assign({},window.history.state):{},Object.assign(a,this.source);break;case'string':case'number':a=this.source;}this._push?window.history.pushState(a,''):window.history.replaceState(a,''),this.historyState=a}}},{key:'attributeChangedCallback',value:function(c,d,e){c===a?this._push=null!==e:c===b?this._replace=null!==e:void 0,this.onPropsChange()}},{key:'_upgradeProperty',value:function(a){if(this.hasOwnProperty(a)){var b=this[a];delete this[a],this[a]=b}}},{key:'connectedCallback',value:function(){this._upgradeProperty('setStateAndPush'),this._upgradeProperty('setStateAndReplace');var a=this;window.addEventListener('popstate',function(){a.broadastHistoryChange(a.historyState,!0)}),this.addEventListener(c,this.updateState),this.historyState=window.history.state}},{key:'disconnectedCallback',value:function(){window.removeEventListener('popstate',this.updateState)}},{key:'updateState',value:function(a){a.type===c&&this===a.target||a.detail&&a.detail.fromPopEvent||(this.historyState=window.history.state)}},{key:'historyState',get:function(){return window.history.state},set:function(a){this.broadastHistoryChange(a,!1)}},{key:'setStateAndPush',get:function(){return this._push},set:function(b){b?this.setAttribute(a,''):this.removeAttribute(a)}},{key:'setStateAndReplace',get:function(){return this._replace},set:function(a){a?this.setAttribute(b,''):this.removeAttribute(b)}},{key:'source',get:function(){return this._source},set:function(a){this._source=a,this.onPropsChange()}}],[{key:'observedAttributes',get:function(){return[a,b]}}]),e}(HTMLElement);customElements.define('xtal-state',d)})();