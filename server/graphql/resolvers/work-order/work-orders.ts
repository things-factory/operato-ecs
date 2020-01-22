import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const workOrders = {
  async workOrders(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(WorkOrder).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}