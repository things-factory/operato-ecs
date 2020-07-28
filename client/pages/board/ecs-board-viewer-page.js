import { BoardViewerPage } from '@things-factory/board-ui'

function serialize(obj) {
  var str = []
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  return str.join('&')
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
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
    const modelId = this._boardId
    const data = {
      title: 'ABCDEFG'
    }
    const queryString = serialize(data)
    const url = `${location.origin}/screenshot/${modelId}${queryString ? '?' + queryString : ''}`

    const response = await fetch(url)
    return await readFileAsync(await response.blob())
  }
}

customElements.define('ecs-board-viewer-page', ECSBoardViewerPage)
