import { LitElement, html, css } from 'lit-element'
import gql from 'graphql-tag'
import { navigate, store, client, gqlBuilder } from '@things-factory/shell'
import { connect } from 'pwa-helpers/connect-mixin.js'

export class MenuPart extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        min-width: 150px;
        height: 100%;
        background-color: var(--primary-color);
      }

      div {
        display: flex;
        padding: 10px 9px 7px 9px;
        border-bottom: var(--menu-tree-toplevel-border-bottom);
      }

      div[active],
      div:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }

      div[active] a,
      div:hover a {
        font: var(--menu-tree-toplevel-active-font);
        color: #fff;
      }

      a {
        text-decoration: none;

        font: var(--menu-tree-toplevel-font);
        color: var(--menu-tree-toplevel-color);
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
        <a @click=${e => this.navigateToHome()} viewer><mwc-icon>home</mwc-icon></a>
      </div>

      ${sheets.map(sheet => {
        var board = sheet.board || {}

        return html`
          <div ?active=${this.boardId == board.id}>
            <a href="board-viewer/${board.id}?title=${sheet.name}" viewer>${sheet.name}</a>
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
