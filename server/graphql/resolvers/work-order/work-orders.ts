import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const workOrders = {
  async workOrders(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(WorkOrder).findAndCount({
      ...convertedParams,
      relations: ['domain', 'saleOrder', 'product', 'creator', 'updater']
    })

    return { items, total }
  }
}