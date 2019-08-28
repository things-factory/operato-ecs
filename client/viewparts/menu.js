import { LitElement, html, css } from 'lit-element'
import gql from 'graphql-tag'
import { client, gqlBuilder } from '@things-factory/shell'

export class MenuPart extends LitElement {
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

      div:hover {
        background-color: var(--primary-background-color);
      }

      a {
        font-size: 1.3em;
        text-decoration: none;
        color: var(--primary-text-color);
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
      sheets: Array
    }
  }

  render() {
    return html`
      ${(this.sheets || []).map(sheet => {
        var board = sheet.board || {}

        return html`
          <div>
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
}

customElements.define('menu-part', MenuPart)
