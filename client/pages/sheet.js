import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import gql from 'graphql-tag'
import { store, PageView, isMobileDevice, client, gqlBuilder } from '@things-factory/shell'

import '@things-factory/grist-ui'
import { i18next } from '@things-factory/i18n-base'

class Sheet extends connect(store)(PageView) {
  static get properties() {
    return {
      config: Object
    }
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        overflow-x: hidden;
        flex-direction: column;
      }

      data-grist {
        flex: 1;
      }
    `
  }

  render() {
    return html`
      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.config}
        .fetchHandler=${this.fetchHandler}
      ></data-grist>

      <div buttons>
        <input type="button" name="reload" value="reload" @click=${e => this.onReload()} />
        <input type="button" name="delete" value="delete" @click=${e => this.onDelete()} />
        <input type="button" name="commit" value="commit" @click=${e => this.onCommit()} />
      </div>
    `
  }

  get grist() {
    return this.shadowRoot.querySelector('data-grist')
  }

  stateChanged(state) {}

  onCommit() {
    console.log('dirties', this.grist.dirtyRecords)
    this.grist.dirtyRecords.forEach(async record => {
      var patch = {
        description: record.description,
        active: record.active,
        boardId: record.board && record.board.id
      }

      await client.mutate({
        mutation: gql`
          mutation UpdateSheet($name: String!, $patch: SheetPatch!) {
            updateSheet(name: $name, patch: $patch) {
              id
              name
            }
          }
        `,
        variables: {
          name: record.name,
          patch: patch
        }
      })
    })
  }

  onReload() {}

  onDelete() {}

  async activated(active) {
    if (!active) {
      return
    }

    this.config = {
      columns: [
        {
          type: 'gutter',
          gutterName: 'dirty'
        },
        {
          type: 'gutter',
          gutterName: 'sequence'
        },
        {
          type: 'gutter',
          gutterName: 'row-selector',
          multiple: true
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
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 120
        },
        {
          type: 'string',
          name: 'description',
          header: i18next.t('field.description'),
          record: {
            align: 'left',
            editable: true
          },
          width: 200
        },
        {
          type: 'object',
          name: 'board',
          header: i18next.t('field.board'),
          record: {
            align: 'center',
            editable: true,
            options: {
              queryName: 'boards'
            }
          },
          width: 240
        },
        {
          type: 'boolean',
          name: 'active',
          header: i18next.t('field.active'),
          record: {
            align: 'center',
            editable: true
          },
          sortable: true,
          width: 60
        },
        {
          type: 'datetime',
          name: 'updatedAt',
          header: i18next.t('field.updated_at'),
          record: {
            align: 'center'
          },
          width: 180
        },
        {
          type: 'datetime',
          name: 'createdAt',
          header: i18next.t('field.created_at'),
          record: {
            align: 'center'
          },
          width: 180
        }
      ],
      rows: {
        selectable: {
          multiple: true
        },
        handlers: {
          click: 'select-row-toggle'
        }
      },
      sorters: [
        {
          name: 'name',
          desc: true
        }
      ],
      pagination: {
        pages: [20, 30, 50, 100, 200]
      }
    }

    this.page = 1
    this.limit = 50

    await this.updateComplete

    this.grist.fetch()
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = (await client.query({
      query: gql`
        {
          sheets(${gqlBuilder.buildArgs({
            filters: [],
            pagination: {
              page,
              limit
            },
            sortings: sorters
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
              createdAt
              updatedAt
              creator {
                id
                name
              }
              updater {
                id
                name
              }
            }
            total
          }
        }
      `
    })).data.sheets

    return {
      records: response.items,
      total: response.total
    }
  }
}

window.customElements.define('sheet-page', Sheet)
