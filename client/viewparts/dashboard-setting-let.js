import { i18next, localize } from '@things-factory/i18n-base'
import { openPopup } from '@things-factory/layout-base'
import { client, store } from '@things-factory/shell'
import { gqlBuilder } from '@things-factory/utils'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'
import { connect } from 'pwa-helpers'
import { UPDATE_DASHBOARD_SETTINGS } from '../actions/dashboard-settings'
import '@things-factory/board-ui'
import { fetchDashboardSettings } from './fetch-dashboard-settings'

const HOME_BOARD = 'home'
const HOME_DESCRIPTION = 'home dashboard'

export class DashboardSettingLet extends connect(store)(localize(i18next)(LitElement)) {
  static get styles() {
    return [
      css`
        div.field {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          max-width: 100%;
          margin-bottom: 20px;
          overflow: hidden;
        }

        div.field > * {
          flex: none;
        }

        div.field > div {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        div.field a {
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          background-color: rgba(0, 0, 0, 0.1);
          min-width: 50px;
          min-height: 50px;
        }

        div.field img {
          max-height: 250px;
          max-width: 100%;
        }

        .name {
          color: var(--secondary-color, #394e64);
        }

        .description {
          font-size: 0.7rem;
          opacity: 0.7;
          color: var(--secondary-text-color);
        }

        label {
          width: 80px;
          text-align: right;
          padding-right: 10px;

          font-size: 1em;
          text-transform: capitalize;
          color: #666;
        }

        setting-let > form {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        mwc-icon {
          background-color: var(--secondary-color, #394e64);
          margin: 2px 2px 5px 2px;
          padding: 0 5px;
          color: var(--button-color, #fff);
          border-radius: var(--button-radius, 5px);
          border: var(--button-border, 1px solid transparent);
          font-size: 18px;
        }

        mwc-icon:hover,
        mwc-icon:active {
          background-color: var(--button-active-background-color, #22a6a7);
          border: var(--button-active-border);
        }

        @media screen and (max-width: 460px) {
          setting-let > form {
            display: inline-grid;
            grid-template-columns: 1fr;
          }
        }
      `
    ]
  }

  static get properties() {
    return {
      homeBoard: Object
    }
  }

  render() {
    return html`
      <setting-let>
        <i18n-msg slot="title" msgid="title.dashboard setting"></i18n-msg>

        <form slot="content" @submit=${e => this._handleSubmit(e)}>
          ${[
            {
              title: i18next.t('title.home dashboard'),
              board: this.homeBoard,
              key: HOME_BOARD,
              description: HOME_DESCRIPTION
            }
          ].map(
            field => html`
              <div class="field">
                <label>${field.title}</i18n-msg></label>
                <div>
                  <div class="name">${field.board.name}</div>
                  <span class="description">${field.board.description}</span>
                  <mwc-icon @click=${e => this.onClickBoardSelector(field.key, field.description)}>
                    more_horiz
                  </mwc-icon>
                  ${
                    field.board.id
                      ? html`
                          <a href=${`board-modeller/${field.board.id}`}>
                            <img
                              src=${field.board.thumbnail ||
                                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
                            />
                          </a>
                        `
                      : html``
                  }
                </div>
              </div>
            `
          )}
        </form>
      </setting-let>
    `
  }

  stateChanged(state) {
    var homeBoard = state.dashboard[HOME_BOARD]

    this.homeBoard = (homeBoard ? homeBoard.board : {}) || {}
  }

  onClickBoardSelector(name, description) {
    var popup = openPopup(
      html`
        <board-selector
          .creatable=${true}
          @board-selected=${async e => {
            var board = e.detail.board

            await this.saveSettings({
              name,
              value: board.id,
              category: 'board',
              description
            })

            var settings = await fetchDashboardSettings()
            store.dispatch({
              type: UPDATE_DASHBOARD_SETTINGS,
              settings: settings.reduce((settings, setting) => {
                settings[setting.name] = setting
                return settings
              }, {})
            })

            popup.close()
            this.requestUpdate()
          }}
        ></board-selector>
      `,
      {
        backdrop: true,
        size: 'large',
        title: i18next.t('title.dashboard setting')
      }
    )
  }

  async saveSettings({ name, value, category, description }) {
    if (!(name && value)) return

    await client.query({
      query: gql`
      mutation {
        updateSetting(${gqlBuilder.buildArgs({
          name,
          patch: {
            name,
            description,
            category,
            value
          }
        })}) {
          name
          value
        }
      }`
    })
  }
}

customElements.define('dashboard-setting-let', DashboardSettingLet)
