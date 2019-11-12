import { MultiColumnFormStyles } from '@things-factory/form-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { client, gqlBuilder, isMobileDevice } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'

class ScenarioDetail extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      scenario: Object,
      gristConfig: Object
    }
  }

  static get styles() {
    return [
      MultiColumnFormStyles,
      css`
        :host {
          padding: 10px;
          display: flex;
          flex-direction: column;
          overflow-x: overlay;
          background-color: var(--main-section-background-color);
        }

        data-grist {
          overflow-y: auto;
          flex: 1;
        }

        h2 {
          padding: var(--subtitle-padding);
          font: var(--subtitle-font);
          color: var(--subtitle-text-color);
          border-bottom: var(--subtitle-border-bottom);
        }

        .button-container {
          display: flex;
        }

        .button-container > mwc-button {
          margin-left: auto;
        }
      `
    ]
  }

  render() {
    return html`
      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.gristConfig}
        .fetchHandler="${this.fetchHandler.bind(this)}"
        .data=${[this.scenario]}
      ></data-grist>
    `
  }

  async updated(changedProps) {
    if (changedProps.has('scenario')) {
      console.log(this.scenario)
    }
  }

  async firstUpdated() {
    this.gristConfig = {
      columns: [
        { type: 'gutter', gutterName: 'sequence' },
        {
          type: 'object',
          name: 'scenario',
          hidden: true
        },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          record: {
            editable: true
          },
          width: 150
        },
        {
          type: 'string',
          name: 'description',
          header: i18next.t('field.description'),
          record: {
            editable: true
          },
          width: 260
        },
        {
          type: 'task-type',
          name: 'task',
          header: i18next.t('field.task'),
          record: {
            editable: true
          },
          width: 150
        },
        {
          type: 'string',
          name: 'params',
          header: i18next.t('field.params'),
          record: {
            editable: true
          },
          width: 300
        }
      ],
      pagination: {
        infinite: true
      }
    }
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = await client.query({
      query: gql`
        query {
          steps(${gqlBuilder.buildArgs({
            filters: [],
            pagination: { page, limit },
            sortings: sorters
          })}) {
            items {
              id
              name
              description
            }
            total
          }
        }
      `
    })

    if (!response.errors) {
      return {
        total: response.data.steps.total || 0,
        records: response.data.steps.items || []
      }
    }
  }
}

window.customElements.define('scenario-detail', ScenarioDetail)
