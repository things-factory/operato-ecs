import { BoardViewerPage } from '@things-factory/board-ui'

function serialize(obj) {
  var str = []
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return str.join('&')
}

export class ECSBoardViewerPage extends BoardViewerPage {
  get context() {
    return {
      title: this.lifecycle.params['title'] || super.context.title,
      printable: {
        accept: ['preview'],
        content: async () => {
          const image = await this.fetchImage()
          await this.printTrick(image)

          return this
        }
      }
    }
  }

  async fetchImage() {
    const modelId = '27b9fe64-1f38-4893-ab5f-6fd8e10691dd'
    const data = {
      title: 'ABCDEFG'
    }
    const queryString = serialize(data)
    const url = `${location.origin}/screenshot/${modelId}${queryString ? '?' + queryString : ''}`

    const response = await fetch(url)
    const image = await response.blob()
    return URL.createObjectURL(image)
  }
}

customElements.define('ecs-board-viewer-page', ECSBoardViewerPage)
