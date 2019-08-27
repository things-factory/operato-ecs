import { LitElement, html, css } from 'lit-element'

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

  render() {
    return html`
      ${[1, 2, 3, 4, 5].map(
        id => html`
          <div>
            <a href="/board-viewer/${id}" viewer>Menu ${id}</a>
            <a href="/board-modeller/${id}" modeller><mwc-icon>edit</mwc-icon></a>
          </div>
        `
      )}
    `
  }
}

customElements.define('menu-part', MenuPart)
