import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { SaleOrderDetail } from '../../../entities'

export const createSaleOrderDetail = {
  async createSaleOrderDetail(_, { product: attrs }) {
    const repository = getRepository(SaleOrderDetail)
    const newSaleOrderDetail = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newSaleOrderDetail)
  }
}