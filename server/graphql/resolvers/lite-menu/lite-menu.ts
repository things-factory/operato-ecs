import { getRepository } from 'typeorm'
import { LiteMenu } from '../../../entities'
import { Board } from '@things-factory/board-service'

export const liteMenuResolver = {
  async liteMenu(_: any, { name }, context: any) {
    const repository = getRepository(LiteMenu)

    var liteMenu: any = await getRepository(LiteMenu).findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'creator', 'updater'] }
    })

    if (liteMenu.type == 'board' && liteMenu.value) {
      liteMenu.board = await getRepository(Board).findOne({ id: liteMenu.value })
    }

    return liteMenu
  }
}
