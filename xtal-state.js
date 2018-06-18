import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `xtal-state`
 * Web component wrapper around the history api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class XtalState extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'xtal-state',
      },
    };
  }
}

window.customElements.define('xtal-state', XtalState);
