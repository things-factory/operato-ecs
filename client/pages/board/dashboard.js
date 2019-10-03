import { BoardViewerPage } from '@things-factory/board-ui'

const HOME_BOARD = 'home'

class Dashboard extends BoardViewerPage {
  get context() {
    return {
      title: this._board && this._board.name
    }
  }

  stateChanged(state) {
    super.stateChanged(state)

    this._boardId = (state.dashboard[HOME_BOARD] || { board: {} }).board.id
  }
}

customElements.define('res-dashboard', Dashboard)
