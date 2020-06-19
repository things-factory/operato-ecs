import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { LiteMenu } from '../../../entities'
import { Board } from '@things-factory/board-service'

export const liteMenusResolver = {
  async liteMenus(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(LiteMenu).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    var [items, total] = await queryBuilder
      .leftJoinAndSelect('LiteMenu.domain', 'Domain')
      .leftJoinAndSelect('LiteMenu.creator', 'Creator')
      .leftJoinAndSelect('LiteMenu.updater', 'Updater')
      .getManyAndCount()

    var cvtItems = await Promise.all(
      items.map(async item => {
        var cvtItem: any = {
          ...item
        }

        if (cvtItem.type == 'board') {
          cvtItem.board = await getRepository(Board).findOne({ id: item.value })
        }

        return cvtItem
      })
    )

    return { items: cvtItems, total }
  }
}
