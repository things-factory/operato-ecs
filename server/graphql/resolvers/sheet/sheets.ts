import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'
import { Board } from '@things-factory/board-service'

export const sheetsResolver = {
  async sheets(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Sheet).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    var [items, total] = await queryBuilder
      .leftJoinAndSelect('Sheet.domain', 'Domain')
      // .leftJoinAndSelect('Sheet.board', 'Board')
      .leftJoinAndSelect('Sheet.creator', 'Creator')
      .leftJoinAndSelect('Sheet.updater', 'Updater')
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
