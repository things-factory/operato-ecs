import { LitElement, html, css } from 'lit-element'
import gql from 'graphql-tag'
import { store, client, gqlBuilder } from '@things-factory/shell'
import { connect } from 'pwa-helpers/connect-mixin.js'

export class MenuPart extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        min-width: 150px;

        margin: 4px;
      }

      div {
        display: flex;
        padding: 2px 4px;
      }

      div[active] {
        background-color: var(--primary-background-color);
      }

      div:hover {
        background-color: var(--primary-background-color);
      }

      a {
        font-size: 1.3em;
        text-decoration: none;
        color: var(--primary-text-color);
      }

      [viewer] {
        flex: 1;
      }

      [modeller] {
        margin-left: auto;
      }

      [modeller]:hover {
        background-color: tomato;
      }

      mwc-icon {
        font-size: 0.8em;
      }
    `
  }

  static get properties() {
    return {
      sheets: Array,
      boardId: String
    }
  }

  render() {
    var sheets = (this.sheets || []).filter(sheet => sheet.active)

    return html`
      ${sheets.map(sheet => {
        var board = sheet.board || {}

        return html`
          <div ?active=${this.boardId == board.id}>
            <a href="/board-viewer/${board.id}" viewer>${sheet.name}</a>
            <a href="/board-modeller/${board.id}" modeller><mwc-icon>edit</mwc-icon></a>
          </div>
        `
      })}
    `
  }

  firstUpdated() {
    this.fetchSheets()
  }

  async fetchSheets() {
    this.sheets = (await client.query({
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
    })).data.sheets.items
  }

  stateChanged(state) {
    this.boardId = state.route.resourceId
  }
}

customElements.define('menu-part', MenuPart)
