import { MultiColumnFormStyles } from '@things-factory/form-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { client, gqlBuilder, isMobileDevice } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'

class ScenarioDetail extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      scenario: Object,
      steps: Array,
      gristConfig: Object
    }
  }

  static get styles() {
    return [
      MultiColumnFormStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          background-color: #fff;
        }

        data-grist {
          flex: 1;
        }

        .button-container {
          display: flex;
          margin-left: auto;
        }

        form {
          position: relative;
        }
      `
    ]
  }

  get dataGrist() {
    return this.shadowRoot.querySelector('data-grist')
  }

  render() {
    return html`
      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.gristConfig}
        .fetchHandler=${this.fetchHandler.bind(this)}
        .data=${{ records: this.steps }}
      ></data-grist>
      <div class="button-container">
        <mwc-button @click=${this._updateSteps.bind(this)}>${i18next.t('button.save')}</mwc-button>
        <mwc-button @click=${() => {}}>${i18next.t('button.delete')}</mwc-button>
      </div>
    `
  }

  async updated(changedProps) {
    if (changedProps.has('steps')) {
      console.log(this.steps)
    }
  }

  async firstUpdated() {
    this.gristConfig = {
      list: { fields: ['name', 'description', 'task'] },
      columns: [
        { type: 'gutter', gutterName: 'row-selector', multiple: true },
        { type: 'gutter', gutterName: 'sequence' },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'arrow_upward',
          handlers: {
            click: (columns, data, column, record, rowIndex) => {}
          }
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'arrow_downward',
          handlers: {
            click: (columns, data, column, record, rowIndex) => {}
          }
        },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          record: {
            editable: true
          },
          width: 140
        },
        {
          type: 'string',
          name: 'description',
          header: i18next.t('field.description'),
          record: {
            editable: true
          },
          width: 180
        },
        {
          type: 'task-type',
          name: 'task',
          header: i18next.t('field.task'),
          record: {
            editable: true
          },
          width: 120
        },
        {
          type: 'json',
          name: 'params',
          header: i18next.t('field.params'),
          record: {
            editable: true
          },
          width: 200
        }
      ],
      pagination: {
        infinite: true
      },
      sorters: [
        {
          name: 'sequence'
        }
      ]
    }
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = await client.query({
      query: gql`
        query {
          scenario(id: "${this.scenario.id}") {
            steps {
              items {
                name
                description
                sequence
                task
                params
              }
              total
            }
          }
        }
      `
    })

    return {
      total: response.data.scenario.steps.total || 0,
      records: response.data.scenario.steps.items || []
    }
  }

  async _updateSteps() {
    let patches = this.dataGrist._data.records
    if (patches && patches.length) {
      patches = patches.map((patch, idx) => {
        let patchField = patch.id ? { id: patch.id } : {}
        const dirtyFields = patch.__dirtyfields__
        for (let key in dirtyFields) {
          patchField[key] = dirtyFields[key].after
        }
        patchField.sequence = idx
        patchField.scenario_id = this.scenario.id
        patchField.cuFlag = patch.__dirty__

        return patchField
      })

      const response = await client.query({
        query: gql`
            mutation {
              updateMultipleStep(${gqlBuilder.buildArgs({
                patches
              })}) {
                name
              }
            }
          `
      })

      if (!response.errors) this.dataGrist.fetch()
    }
  }
}

window.customElements.define('scenario-detail', ScenarioDetail)
