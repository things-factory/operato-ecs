import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { SaleOrder } from '../../../entities'

export const saleOrders = {
  async saleOrders(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(SaleOrder).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}