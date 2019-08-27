import { html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'

class Home extends connect(store)(PageView) {
  static get properties() {
    return {
      home: String
    }
  }

  get context() {
    return {
      title: 'HAHAHA'
    }
  }

  render() {
    return html`
      <section>
        <h2>home</h2>
        <img src=${logo}></img>
      </section>
    `
  }

  stateChanged(state) {}
}

window.customElements.define('home-page', Home)
