import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const stocksResolver = {
  async stocks(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Stock).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}