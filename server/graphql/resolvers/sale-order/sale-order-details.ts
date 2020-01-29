import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { SaleOrderDetail } from '../../../entities'

export const saleOrderDetails = {
  async saleOrderDetails(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(SaleOrderDetail).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}