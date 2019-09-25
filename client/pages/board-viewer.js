import { html, css } from 'lit-element'
import gql from 'graphql-tag'

import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView, client } from '@things-factory/shell'
import { provider } from '@things-factory/board-ui'
import './things-scene-components.import'

class BoardViewerPage extends connect(store)(PageView) {
  static get properties() {
    return {
      _board: Object,
      _boardId: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;

          width: 100%; /* 전체화면보기를 위해서 필요함. */
          height: 100%;

          overflow: hidden;
        }

        board-viewer {
          flex: 1;
        }
      `
    ]
  }

  get context() {
    return {
      title: this._board && 'test'
    }
  }

  render() {
    return html`
      <board-viewer .board=${this._board} .provider=${provider}></board-viewer>
    `
  }

  get boardViewer() {
    return this.shadowRoot.querySelector('board-viewer')
  }

  updated(changes) {
    if (changes.has('_boardId')) {
      this.boardViewer && this.boardViewer.closeScene()
      this.refresh()
    }
  }

  async refresh() {
    if (!this._boardId) {
      return
    }

    var response = await client.query({
      query: gql`
        query FetchBoardById($id: String!) {
          board(id: $id) {
            id
            name
            model
          }
        }
      `,
      variables: { id: this._boardId }
    })

    var board = response.data.board

    this._board = {
      ...board,
      model: JSON.parse(board.model)
    }

    this.updateContext()
  }

  pageUpdated(changes, lifecycle) {
    if (this.active) {
      this._boardId = lifecycle.resourceId
    } else {
      this._boardId = null
      this.boardViewer.closeScene()
    }
  }
}

customElements.define('show-board', BoardViewerPage)
