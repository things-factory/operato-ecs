import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'

import gql from 'graphql-tag'
import { store, PageView, client } from '@things-factory/shell'
import { isMobileDevice, gqlBuilder } from '@things-factory/utils'
import { i18next, localize } from '@things-factory/i18n-base'
import { getRenderer, getEditor } from '@things-factory/grist-ui'

import '@things-factory/grist-ui'

class LiteMenu extends connect(store)(localize(i18next)(PageView)) {
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

  get context() {
    return {
      title: i18next.t('text.lite-menu management'),
      actions: [
        {
          title: i18next.t('button.reload'),
          action: () => {
            this.onReload()
          }
        },
        {
          title: i18next.t('button.delete'),
          action: () => {
            this.onDelete()
          }
        },
        {
          title: i18next.t('button.save'),
          action: () => {
            this.onCommit()
          }
        }
      ],
      exportable: {
        accept: ['json'],
        name: 'lite-menu-list',
        data: () => {
          return this.grist.data
        }
      }
    }
  }

  render() {
    return html`
      <data-grist
        .mode=${isMobileDevice() ? 'LIST' : 'GRID'}
        .config=${this.config}
        .fetchHandler=${this.fetchHandler}
      ></data-grist>
    `
  }

  get grist() {
    return this.shadowRoot.querySelector('data-grist')
  }

  async onCommit() {
    var grist = this.grist

    var modifiedList = grist.dirtyRecords.filter(record => record['__dirty__'] == 'M')
    var addedList = grist.dirtyRecords.filter(record => record['__dirty__'] == '+')

    await Promise.all(
      modifiedList.map(async record => {
        var originalName = record.__origin__.name
        var patch = {
          name: record.name,
          description: record.description,
          rank: record.rank,
          active: record.active,
          type: record.type,
          value: record.value
        }

        return await client.mutate({
          mutation: gql`
            mutation($name: String!, $patch: LiteMenuPatch!) {
              updateLiteMenu(name: $name, patch: $patch) {
                id
                name
              }
            }
          `,
          variables: {
            name: originalName,
            patch: patch
          }
        })
      })
    )

    await Promise.all(
      addedList.map(async record => {
        var liteMenu = {
          name: record.name,
          description: record.description,
          rank: record.rank,
          active: record.active,
          type: record.type,
          value: record.value
        }

        return await client.mutate({
          mutation: gql`
            mutation($liteMenu: NewLiteMenu!) {
              createLiteMenu(liteMenu: $liteMenu) {
                id
                name
              }
            }
          `,
          variables: {
            liteMenu
          }
        })
      })
    )

    grist.fetch()
  }

  onReload() {
    this.grist.fetch()
  }

  async onDelete() {
    var grist = this.grist

    var deletedList = grist.selected

    await Promise.all(
      deletedList.map(async record => {
        var name = record.name

        return await client.mutate({
          mutation: gql`
            mutation($name: String!) {
              deleteLiteMenu(name: $name)
            }
          `,
          variables: {
            name
          }
        })
      })
    )

    grist.fetch()
  }

  async pageInitialized() {
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
          type: 'number',
          name: 'rank',
          header: i18next.t('field.rank'),
          record: {
            align: 'right',
            editable: true
          },
          sortable: true,
          width: 60
        },
        {
          type: 'select',
          name: 'type',
          header: i18next.t('field.type'),
          record: {
            align: 'center',
            editable: true,
            options: ['', 'page', 'board']
          },
          width: 80
        },
        {
          type: 'string',
          name: 'value',
          header: i18next.t('field.value'),
          record: {
            align: 'center',
            editable: true,
            editor: function (value, column, record, rowIndex, field) {
              var type = record.type == 'page' ? 'string' : record.type
              return getEditor(type)(value, column, record, rowIndex, field)
            },
            renderer: function (value, column, record, rowIndex, field) {
              var type = record.type == 'page' ? 'string' : record.type
              return getRenderer(type)(value, column, record, rowIndex, field)
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
          name: 'rank',
          desc: false
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

  async pageUpdated(changes, lifecycle) {
    if (this.active) {
      await this.updateComplete

      this.grist.fetch()
    }
  }

  async fetchHandler({ page, limit, sorters = [] }) {
    const response = (
      await client.query({
        query: gql`
        {
          liteMenus(${gqlBuilder.buildArgs({
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
              rank
              type
              value
              board {
                id
                name
                description
                thumbnail
              }
              active
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
      })
    ).data.liteMenus

    store.dispatch({
      type: 'UPDATE_LITE_MENUS',
      liteMenus: response.items
    })

    return {
      records: response.items,
      total: response.total
    }
  }
}

window.customElements.define('lite-menu-page', LiteMenu)
