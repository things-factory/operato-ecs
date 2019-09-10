import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Order } from '../../../entities'

export const ordersResolver = {
  async orders(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Order).createQueryBuilder()
    buildQuery(queryBuilder, params)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}