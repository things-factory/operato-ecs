import { MultiColumnFormStyles } from '@things-factory/form-ui'
import { i18next, localize } from '@things-factory/i18n-base'
import { client, gqlBuilder, isMobileDevice } from '@things-factory/shell'
import gql from 'graphql-tag'
import { css, html, LitElement } from 'lit-element'

class SaleOrderDetail extends localize(i18next)(LitElement) {
  static get properties() {
    return {
      saleOrder: Object,
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
        <mwc-button @click=${this._updateSaleOrderDetails.bind(this)}>${i18next.t('button.save')}</mwc-button>
        <mwc-button @click=${this._deleteSaleOrderDetails.bind(this)}>${i18next.t('button.delete')}</mwc-button>
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
          type: 'string',
          name: 'id',
          hidden: true
        },
        {
          type: 'string',
          name: 'name',
          header: i18next.t('field.name'),
          hidden: true,
          record: {
            editable: true
          },
          width: 140
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
            editable: false
          },
          hidden: true,
          width: 120
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: i18next.t('field.updated_at'),
          sortable: true,
          hidden: true,
          width: 180
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
          saleOrder(id: "${this.saleOrder.id}") {
            details {
              id
              name
              product {
                id
                code
                name
                description
              }
              qty
              status
            }
          }
        }
      `
    })

    return {
      total: response.data.saleOrder.details.length || 0,
      records: response.data.saleOrder.details || []
    }
  }

  async _updateDetails() {
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
            updateMultipleSaleOrderDetail(saleOrderId: "${this.saleOrder.id}", ${gqlBuilder.buildArgs({
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

  async _updateSaleOrderDetails() {

  }

  async _deleteSaleOrderDetails() {
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

window.customElements.define('sale-order-detail', SaleOrderDetail)
