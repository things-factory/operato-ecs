import { convertListParams, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { SaleOrder } from '../../../entities'

export const saleOrders = {
  async saleOrders(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(SaleOrder).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })

    return { items, total }
  }
}