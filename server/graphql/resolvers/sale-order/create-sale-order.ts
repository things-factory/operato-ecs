import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { SaleOrder } from '../../../entities'

export const createSaleOrder = {
  async createSaleOrder(_, { saleOrder: attrs }, context: any) {
    const repository = getRepository(SaleOrder)
    const newSaleOrder = {
      id: uuid(),
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...attrs
    }

    return await repository.save(newSaleOrder)
  }
}