import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'
import { Board } from '@things-factory/board-service'

export const updateSheet = {
  async updateSheet(_: any, { name, patch }, context: any) {
    const repository = getRepository(Sheet)
    const sheet = await repository.findOne({ name })

    var board = sheet.board

    if ('boardId' in patch) {
      board = await getRepository(Board).findOne({ id: patch.boardId })
    }

    return await repository.save({
      ...sheet,
      ...patch,
      board,
      updater: context.state.user
    })
  }
}
