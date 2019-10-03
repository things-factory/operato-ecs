import { BoardViewerPage } from '@things-factory/board-ui'

class BoardPage extends BoardViewerPage {
  get context() {
    return {
      title: super.context.title
    }
  }
}

customElements.define('show-board', BoardPage)
