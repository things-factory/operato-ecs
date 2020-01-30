import { SingleColumnFormStyles } from '@things-factory/form-ui'
import '@things-factory/grist-ui'
import gql from 'graphql-tag'
import { client, CustomAlert, gqlBuilder, isMobileDevice, PageView } from '@things-factory/shell'
import { i18next, localize } from '@things-factory/i18n-base'
import { css, html } from 'lit-element'

class WorkOrders extends localize(i18next)(PageView) {
  static get properties() {
    return {
      // _searchFields: Array,
      // config: Object,
      data: Object,
      // importHandler: Object
    }
  }

  static get styles() {
    return [
      SingleColumnFormStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        search-form {
          overflow: visible;
        }

        data-grist {
          overflow-y: auto;
          flex: 1;
        }
      `
    ]
  }

  render() {
    return html`
    <search-form id="search-form" .fields=${this._searchFields} @submit=${e => this.dataGrist.fetch()}></search-form>
    
      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.config}
        .fetchHandler="${this.fetchHandler.bind(this)}"
      ></data-grist>
    `
  }

  get context() {
    return {
      title: i18next.t('title.workorder'),
      actions: [
        {
          title: i18next.t('button.save'),
          action: this._saveWorkOrder.bind(this)
        },
        {
          title: i18next.t('button.delete'),
          action: this._deleteWorkOrder.bind(this)
        }
      ],
      exportable: {
        name: i18next.t('title.workorder'),
        data: this._exportableData.bind(this)
      },
      // importable: {
      //   handler: this._importableData.bind(this)
      // }
    }
  }

  async pageInitialized() {
    this._searchFields = [
      {
        label: i18next.t('field.workorder'),
        name: 'code',
        type: 'text',
        props: { searchOper: 'i_like' }
      }
    ]

    this.config = {
      rows: { selectable: { multiple: true } },
      list: {
        fields: ['id', 'name', 'qty', 'saleOrder', 'product', 'status', 'updatedAt', 'updater']
      },
      columns: [
        { type: 'gutter', gutterName: 'dirty' },
        { type: 'gutter', gutterName: 'sequence' },
        { type: 'gutter', gutterName: 'row-selector', multiple: true },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          sortable: true,
          width: 240,
          record: {
            align: 'center',
            editable: true
          }
        },
        {
          type: 'string',
          name: 'qty',
          header: i18next.t('field.qty'),
          sortable: true,
          width: 60,
          // hidden: true,
          record: {
            align: 'center',
            editable: true
          }
        },
        {
          type: 'object',
          name: 'saleOrder',
          header: i18next.t('field.saleOrder'),
          hidden: true,
          record: {
            editable: false
          },
          width: 120
        },
        {
          type: 'object',
          name: 'product',
          header: i18next.t('field.product'),
          record: {
            editable: false
          },
          width: 200
        },
        {
          type: 'string',
          name: 'status',
          header: i18next.t('field.status'),
          sortable: true,
          width: 100,
          record: {
            align: 'center',
            editable: true
          }
        },
        {
          type: 'object',
          name: 'updater',
          header: i18next.t('field.updater'),
          record: {
            align: 'center',
            editable: false
          },
          width: 120
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: i18next.t('field.updated_at'),
          sortable: true,
          width: 180
        },
      ]
    }
  }

  get searchForm() {
    return this.shadowRoot.querySelector('search-form')
  }

  get dataGrist() {
    return this.shadowRoot.querySelector('data-grist')
  }

  get _columns() {
    return this.config.columns
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = await client.query({
      query: gql`
        query {
          workOrders(${gqlBuilder.buildArgs({
            filters: this.searchForm.queryFilters,
            pagination: { page, limit },
            sortings: sorters
          })}) {
            items {
              id
              name
              qty
              status
              saleOrder {
                id
                name
                description
              }
              product {
                id
                name
                description
              }
              updater {
                id
                name
                description
              }
              updatedAt
            }
          }
        }
      `
    })

    if (!response || !response.data) {
      return {
        total: 0,
        records: []
      }
    }

    return {
      total: response.data.workOrders.total || 0,
      records: response.data.workOrders.items || []
    }
  }

  async _saveWorkOrder() {
    let patches = this.dataGrist.exportPatchList({ flagName: 'cuFlag' })
    if (patches && patches.length) {
      const response = await client.query({
        query: gql`
          mutation {
            updateMultipleWorkOrder(${gqlBuilder.buildArgs({
              patches
            })}) {
              name
            }
          }
        `
      })

      if (!response.errors) {
        this.dataGrist.fetch()
        document.dispatchEvent(
          new CustomEvent('notify', {
            detail: {
              message: i18next.t('text.data_updated_successfully')
            }
          })
        )
      }
    }
  }

  async _deleteWorkOrder() {
    CustomAlert({
      title: i18next.t('text. are_you_sure'),
      text: i18next.t('text.you_want_be_able_to_revert_this'),
      type: 'warning',
      confirmButton: { text: i18next.t('button.delete'), color: '#22a6a7' },
      cancelButton: { text: 'cancel', color: '#cfcfcf' },
      callback: async result => {
        if (result.value) {
          const ids = this.dataGrist.selected.map(record => record.id)
          if (ids && ids.length > 0) {
            const response = await client.query({
              query: gql`
                mutaion {
                  deleteWorkOrder(${gqlBuilder.buildArgs({ ids })})
                }
              `
            })

            if (!response.errors) {
              this.dataGrist.fetch()
              document.dispatchEvent(
                new CustomEvent('notify', {
                  detail: {
                    message: i18next.t('text.data_deleted_successfully')
                  }
                })
              )
            }
          }
        }
      }
    })
  }

  _exportableData() {
    let records = []
    if (this.dataGrist.selected && this.dataGrist.selected.length > 0) {
      records = this.dataGrist.selected
    } else {
      records = this.dataGrist.data.records
    }

    var headerSetting = this.dataGrist._config.columns
      .filter(column => column.type !== 'gutter' && column.record !== undefined && column.imex !== undefined)
      .map(column => {
        return column.imex
      })

    var data = records.map(item => {
      return {
        id: item.id,
        ...this._columns
          .filter(column => column.type !== 'gutter' && column.record !== undefined && column.imex !== undefined)
          .reduce((record, column) => {
            record[column.imex.key] = column.imex.key
              .split('.')
              .reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), item)
            
            return record
          }, {})
      }
    })

    return { header: headerSetting, data: data }
  }

  _validate() {
    if (!this._form.checkValidity()) {
      throw new Error(i18next.t('text.invalid_form'))
    }
  }

  _showToast({ type, message }) {
    document.dispatchEvent(
      new CustomEvent('notify', {
        detail: {
          type,
          message
        }
      })
    )
  }
}

window.customElements.define('workorder-page', WorkOrders)