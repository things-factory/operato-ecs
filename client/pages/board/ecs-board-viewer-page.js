import { BoardViewerPage } from '@things-factory/board-ui'

export class ECSBoardViewerPage extends BoardViewerPage {
  get context() {
    return {
      title: this.lifecycle.params['title'] || super.context.title
    }
  }
}

customElements.define('ecs-board-viewer-page', ECSBoardViewerPage)
