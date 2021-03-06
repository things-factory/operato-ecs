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

      [viewer] {
        flex: 1;
      }
    `
  }

  static get properties() {
    return {
      sheets: Array,
      boardId: String,
      user: Object
    }
  }

  render() {
    var sheets = (this.sheets || []).filter(sheet => sheet.active)

    return html`
      <div ?active=${this.isHome()}>
        <a @click=${e => this.navigateToHome()} viewer><mwc-icon>home</mwc-icon> home</a>
      </div>

      ${sheets.map(sheet => {
        var board = sheet.board || {}

        return html`
          <div ?active=${this.boardId == board.id}>
            <a href="board-viewer/${board.id}?title=${sheet.name}" viewer
              ><mwc-icon>description</mwc-icon> ${sheet.name}</a
            >
          </div>
        `
      })}
    `
  }

  updated(changes) {
    if (changes.has('user') && this.user) {
      this.fetchSheets()
    }
  }

  async fetchSheets() {
    var sheets = (
      await client.query({
        query: gql`
        {
          sheets(${gqlBuilder.buildArgs({
            filters: [],
            pagination: {},
            sortings: []
          })}) {
            items {
              id
              name
              description
              active
              board {
                id
                name
                description
              }
            }
            total
          }
        }
      `
      })
    ).data.sheets.items

    store.dispatch({
      type: 'UPDATE_SHEETS',
      sheets: sheets
    })
  }

  stateChanged(state) {
    this.boardId = state.route.resourceId
    this.sheets = state.sheets.sheets
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
