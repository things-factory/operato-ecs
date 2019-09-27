import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'
import { Board } from '@things-factory/board-service'

export const createSheet = {
  async createSheet(_: any, { sheet }, context: any) {
    var board = await getRepository(Board).findOne({ id: sheet.boardId })

    return await getRepository(Sheet).save({
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...sheet,
      board
    })
  }
}
