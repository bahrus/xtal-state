(function(){var a='make',b='rewrite',c=function(c){function d(){return babelHelpers.classCallCheck(this,d),babelHelpers.possibleConstructorReturn(this,(d.__proto__||Object.getPrototypeOf(d)).apply(this,arguments))}return babelHelpers.inherits(d,c),babelHelpers.createClass(d,[{key:'onInputPropsChange',value:function(){if((this._make||this._rewrite)&&this.history){var a;switch(babelHelpers.typeof(this.history)){case'object':a=window.history.state?Object.assign({},window.history.state):{},Object.assign(a,this.history);break;case'string':case'number':a=this.history;}this.make?window.history.pushState(a,''):window.history.replaceState(a,'')}}},{key:'attributeChangedCallback',value:function(c,d,e){c===a?this._make=null!==e:c===b?this._rewrite=null!==e:void 0,this.onInputPropsChange()}},{key:'_upgradeProperty',value:function(a){if(this.hasOwnProperty(a)){var b=this[a];delete this[a],this[a]=b}}},{key:'connectedCallback',value:function(){var a=this;d.properties.forEach(function(b){return a._upgradeProperty(b)})}},{key:'make',get:function(){return this.make},set:function(b){null===b?this.removeAttribute(a):this.setAttribute(a,'')}},{key:'rewrite',get:function(){return this._rewrite},set:function(a){a?this.setAttribute(b,''):this.removeAttribute(b)}},{key:'history',get:function(){return this._history},set:function(a){this._history=a,this.onInputPropsChange()}}],[{key:'properties',get:function(){return[a,b,'history']}},{key:'observedAttributes',get:function(){var a=d.properties;return[a[0],a[1]]}}]),d}(HTMLElement);customElements.define('xtal-state',c)})();