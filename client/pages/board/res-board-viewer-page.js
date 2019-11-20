import { BoardViewerPage } from '@things-factory/board-ui'

export class ResBoardViewerPage extends BoardViewerPage {
  get context() {
    return {
      title: this.lifecycle.params['title'] || super.context.title
    }
  }
}

customElements.define('res-board-viewer-page', ResBoardViewerPage)
