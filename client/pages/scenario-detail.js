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
      ></data-grist>
      <div class="button-container">
        <mwc-button @click=${this._updateSteps.bind(this)}>${i18next.t('button.save')}</mwc-button>
        <mwc-button @click=${this._deleteSteps.bind(this)}>${i18next.t('button.delete')}</mwc-button>
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
            click: (...args) => this._moveRecord(-1, ...args)
          }
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'arrow_downward',
          handlers: {
            click: (...args) => this._moveRecord(1, ...args)
          }
        },
        {
          type: 'number',
          name: 'sequence',
          hidden: true
        },
        {
          type: 'string',
          name: 'id',
          hidden: true
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
          type: 'connection',
          name: 'connection',
          header: i18next.t('field.connection'),
          record: {
            editable: true
          },
          width: 160
        },
        {
          type: 'parameters',
          name: 'params',
          header: i18next.t('field.params'),
          record: {
            editable: true,
            options: async (value, column, record, row, field) => {
              var task = record.task

              if (!task) {
                return []
              }

              var taskType = await this.fetchTaskType(task)
              return taskType.parameterSpec
            }
          },
          width: 200
        }
      ],
      rows: {
        selectable: {
          multiple: true
        }
      },
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
              id
              name
              description
              sequence
              task
              connection
              params
            }
          }
        }
      `
    })

    return {
      total: response.data.scenario.steps.length || 0,
      records: response.data.scenario.steps || []
    }
  }

  async fetchTaskType(name) {
    const response = await client.query({
      query: gql`
        query {
          taskType(${gqlBuilder.buildArgs({
            name
          })}) {
            name
            description
            parameterSpec {
              type
              name
              label
              placeholder
              property
            }
          }
        }
      `
    })

    return response.data.taskType
  }

  async _updateSteps() {
    let patches = this.dataGrist._data.records
    if (patches && patches.length) {
      patches = patches.map(patch => {
        var patchField = {}
        const dirtyFields = patch.__dirtyfields__
        for (let key in dirtyFields) {
          patchField[key] = dirtyFields[key].after
        }

        return { ...patch.__origin__, ...patchField }

        // let patchField = patch.id ? { id: patch.id } : {}
        // return patchField
      })

      const response = await client.query({
        query: gql`
          mutation {
            updateMultipleStep(scenarioId: "${this.scenario.id}", ${gqlBuilder.buildArgs({
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

  async _deleteSteps() {
    if (
      confirm(
        i18next.t('text.sure_to_x', {
          x: i18next.t('text.delete')
        })
      )
    ) {
      const ids = this.dataGrist.selected.map(record => record.id)
      if (ids && ids.length > 0) {
        const response = await client.query({
          query: gql`
            mutation {
              deleteSteps(${gqlBuilder.buildArgs({ ids })})
            }
          `
        })

        if (!response.errors) {
          this.dataGrist.fetch()
          await document.dispatchEvent(
            new CustomEvent('notify', {
              detail: {
                message: i18next.t('text.info_x_successfully', {
                  x: i18next.t('text.delete')
                })
              }
            })
          )
        }
      }
    }
  }

  _moveRecord(steps, columns, data, column, record, rowIndex) {
    if (rowIndex >= data.records.length || rowIndex + steps < 0 || rowIndex + steps > data.records.length) return
    var grist = this.dataGrist
    grist._data.records.splice(rowIndex, 1)
    grist._data.records.splice(rowIndex + steps, 0, record)
    grist.refresh()
  }
}

window.customElements.define('scenario-detail', ScenarioDetail)
