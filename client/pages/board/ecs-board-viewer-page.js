import { BoardViewerPage } from '@things-factory/board-ui'

export class ECSBoardViewerPage extends BoardViewerPage {
  get context() {
    return {
      title: this.lifecycle.params['title'] || super.context.title,
      printable: {
        accept: ['preview'],
        content: async () => {
          await this.printTrick()

          return this
        }
      }
    }
  }
}

customElements.define('ecs-board-viewer-page', ECSBoardViewerPage)
