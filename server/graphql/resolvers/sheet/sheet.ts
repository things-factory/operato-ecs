import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'
import { Board } from '@things-factory/board-service'

export const sheetResolver = {
  async sheet(_: any, { name }, context: any) {
    const repository = getRepository(Sheet)

    var sheet: any = await getRepository(Sheet).findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'creator', 'updater'] }
    })

    if (sheet.type == 'board' && sheet.value) {
      sheet.board = await getRepository(Board).findOne({ id: sheet.value })
    }

    return sheet
  }
}
