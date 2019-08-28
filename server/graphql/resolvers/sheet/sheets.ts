import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'

export const sheetsResolver = {
  async sheets(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Sheet).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder
      .leftJoinAndSelect('Sheet.domain', 'Domain')
      .leftJoinAndSelect('Sheet.board', 'Board')
      .leftJoinAndSelect('Sheet.creator', 'Creator')
      .leftJoinAndSelect('Sheet.updater', 'Updater')
      .getManyAndCount()

    return { items, total }
  }
}
