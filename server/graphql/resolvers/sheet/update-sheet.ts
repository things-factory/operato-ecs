import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'
import { Board } from '@things-factory/board-service'

export const updateSheet = {
  async updateSheet(_: any, { name, patch }, context: any) {
    const repository = getRepository(Sheet)
    const sheet = await repository.findOne({
      where: { domain: context.state.domain, name }
    })

    // if(sheet.type == 'board') {

    // }
    // var board = sheet.value

    // if ('boardId' in patch) {
    //   board = await getRepository(Board).findOne({ id: patch.boardId })
    //   delete patch.boardId
    // }

    return await repository.save({
      creater: context.state.user,
      domain: context.state.domain,
      ...sheet,
      ...patch,
      // board,
      updater: context.state.user
    })
  }
}
