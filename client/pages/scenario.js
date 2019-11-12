import '@things-factory/grist-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { openPopup } from '@things-factory/layout-base'
import { client, gqlBuilder, isMobileDevice, PageView, ScrollbarStyles, store } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin'

class Scenario extends connect(store)(localize(i18next)(PageView)) {
  static get properties() {
    return {
      active: String,
      _searchFields: Array,
      config: Object
    }
  }

  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        search-form {
          overflow: visible;
        }
        .grist {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: auto;
        }
        data-grist {
          overflow-y: hidden;
          flex: 1;
        }
      `
    ]
  }

  get context() {
    return {
      title: i18next.t('text.scenario'),
      actions: [
        {
          title: i18next.t('button.commit'),
          action: this._updateScenario.bind(this)
        },
        {
          title: i18next.t('button.delete'),
          action: this._deleteScenario.bind(this)
        }
      ]
    }
  }

  render() {
    return html`
      <search-form
        id="search-form"
        .fields=${this._searchFields}
        @submit=${async () => this.dataGrist.fetch()}
      ></search-form>

      <div class="grist">
        <data-grist
          .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
          .config=${this.config}
          .fetchHandler="${this.fetchHandler.bind(this)}"
        ></data-grist>
      </div>
    `
  }

  get searchForm() {
    return this.shadowRoot.querySelector('search-form')
  }

  get dataGrist() {
    return this.shadowRoot.querySelector('data-grist')
  }

  async pageInitialized() {
    this._searchFields = [
      {
        name: 'name',
        type: 'text',
        props: {
          placeholder: i18next.t('field.name'),
          searchOper: 'like'
        }
      },
      {
        name: 'description',
        type: 'text',
        props: {
          placeholder: i18next.t('field.description'),
          searchOper: 'like'
        }
      }
    ]

    this.config = {
      columns: [
        { type: 'gutter', gutterName: 'sequence' },
        { type: 'gutter', gutterName: 'row-selector', multiple: true },
        {
          type: 'object',
          name: 'domain',
          hidden: true
        },
        {
          type: 'gutter',
          gutterName: 'button',
          icon: 'reorder',
          handlers: {
            click: (columns, data, column, record, rowIndex) => {
              openPopup('scenario-detail')
            }
          }
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
          width: 200
        },
        {
          type: 'object',
          name: 'updater',
          header: i18next.t('field.updater'),
          record: {
            editable: true
          },
          width: 180
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: i18next.t('field.updated_at'),
          record: {
            editable: true
          },
          width: 180
        }
      ]
    }

    await this.updateComplete

    this.dataGrist.fetch()
  }

  async pageUpdated(changes, lifecycle) {
    if (this.active) {
      await this.updateComplete

      this.dataGrist.fetch()
    }
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = await client.query({
      query: gql`
        query {
          responses: scenarios(${gqlBuilder.buildArgs({
            filters: this._conditionParser(),
            pagination: { page, limit },
            sortings: sorters
          })}) {
            items {
              id
              domain {
                id
                name
                description
              }
              name
              description
              steps {
                items {
                  name
                  sequence
                  task
                  params
                }
              }
              updater {
                id
                name
                description
              }
              updatedAt
            }
            total
          }
        }
      `
    })

    return {
      total: response.data.responses.total || 0,
      records: response.data.responses.items || []
    }
  }

  _conditionParser() {
    return this.searchForm
      .getFields()
      .filter(field => (field.type !== 'checkbox' && field.value && field.value !== '') || field.type === 'checkbox')
      .map(field => {
        return {
          name: field.name,
          value:
            field.type === 'text'
              ? field.value
              : field.type === 'checkbox'
              ? field.checked
              : field.type === 'number'
              ? parseFloat(field.value)
              : field.value,
          operator: field.getAttribute('searchOper')
        }
      })
  }

  async _deleteScenario(name) {
    if (confirm(i18next.t('text.sure_to_delete'))) {
      const names = this.dataGrist.selected.map(record => record.name)
      if (names && names.length > 0) {
        const response = await client.query({
          query: gql`
                mutation {
                  deleteScenario(${gqlBuilder.buildArgs({ name })})
                }
              `
        })

        if (!response.errors) {
          this.dataGrist.fetch()
          await document.dispatchEvent(
            new CustomEvent('notify', {
              detail: {
                message: i18next.t('text.info_delete_successfully')
              }
            })
          )
        }
      }
    }
  }

  async stateChanged(state) {
    if (this.active && this._currentPopupName && !state.layout.viewparts[this._currentPopupName]) {
      this.dataGrist.fetch()
      this._currentPopupName = null
    }
  }

  async _updateScenario() {
    let patches = this.dataGrist.dirtyRecords
    if (patches && patches.length) {
      patches = patches.map(patch => {
        let patchField = patch.id ? { id: patch.id } : {}
        const dirtyFields = patch.__dirtyfields__
        for (let key in dirtyFields) {
          patchField[key] = dirtyFields[key].after
        }
        patchField.cuFlag = patch.__dirty__

        return patchField
      })

      const response = await client.query({
        query: gql`
            mutation {
              updateMultipleScenario(${gqlBuilder.buildArgs({
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

window.customElements.define('scenario-page', Scenario)
