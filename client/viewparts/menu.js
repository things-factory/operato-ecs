import { LitElement, html, css } from 'lit-element'
import gql from 'graphql-tag'
import { navigate, store, client } from '@things-factory/shell'
import { gqlBuilder } from '@things-factory/utils'
import { connect } from 'pwa-helpers/connect-mixin.js'

export class MenuPart extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        min-width: 200px;
        height: 100%;
        background-color: var(--secondary-color);
      }

      div {
        display: flex;
        background-color: var(--opacity-light-dark-color);
      }

      a {
        text-decoration: none;
        text-transform: capitalize;

        padding: var(--menu-padding);
        border-bottom: var(--border-dark-color);
        font: var(--menu-font);
        color: var(--menu-color);
      }

      a mwc-icon {
        position: relative;
        top: 2px;

        font: var(--menu-icon-font);
        color: var(--menu-icon-font-color);
      }

      div[active] a,
      div:hover a {
        font-weight: bold;

        background-color: var(--primary-color);
        color: var(--menu-active-color);
      }

      [menu] {
        flex: 1;
      }
    `
  }

  static get properties() {
    return {
      liteMenus: Array,
      resource: String,
      user: Object
    }
  }

  render() {
    var liteMenus = (this.liteMenus || [])
      .filter(liteMenu => liteMenu.active)
      .sort((m1, m2) => {
        return m1.rank - m2.rank
      })

    return html`
      <div ?active=${this.isHome()}>
        <a @click=${e => this.navigateToHome()} menu><mwc-icon>home</mwc-icon> home</a>
      </div>

      ${liteMenus.map(liteMenu => {
        return html`
          <div ?active=${this.resource == liteMenu.value}>
            ${liteMenu.type == 'board'
              ? html`
                  <a href="board-viewer/${liteMenu.value}?title=${liteMenu.name}" menu
                    ><mwc-icon>description</mwc-icon> ${liteMenu.name}</a
                  >
                `
              : html`
                  <a href="${liteMenu.value}?title=${liteMenu.name}" menu
                    ><mwc-icon>description</mwc-icon> ${liteMenu.name}</a
                  >
                `}
          </div>
        `
      })}
    `
  }

  updated(changes) {
    if (changes.has('user') && this.user) {
      this.fetchLiteMenus()
    }
  }

  async fetchLiteMenus() {
    var liteMenus = (
      await client.query({
        query: gql`
        {
          liteMenus(${gqlBuilder.buildArgs({
            filters: [],
            pagination: {},
            sortings: []
          })}) {
            items {
              id
              name
              description
              rank
              active
              type
              value
            }
            total
          }
        }
      `
      })
    ).data.liteMenus.items

    store.dispatch({
      type: 'UPDATE_LITE_MENUS',
      liteMenus: liteMenus
    })
  }

  stateChanged(state) {
    this.resource = state.route.resourceId
    this.liteMenus = state.liteMenus.liteMenus
    this.user = state.auth.user
  }

  isHome() {
    var pathname = location.pathname
    var base = document.querySelector('base')
    if (base) {
      return pathname == base.getAttribute('href')
    } else {
      return pathname == '/'
    }
  }

  navigateToHome() {
    var base = document.querySelector('base')
    if (base) {
      navigate(base.getAttribute('href'))
    } else {
      navigate('/')
    }
  }
}

customElements.define('menu-part', MenuPart)
