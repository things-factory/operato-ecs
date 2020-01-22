import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { SaleOrder } from '../../../entities'

export const createSaleOrder = {
  async createSaleOrder(_, { saleOrder: attrs }) {
    const repository = getRepository(SaleOrder)
    const newSaleOrder = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newSaleOrder)
  }
}