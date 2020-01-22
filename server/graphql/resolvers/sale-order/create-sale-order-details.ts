import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { SaleOrderDetail } from '../../../entities'

export const createSaleOrderDetail = {
  async createSaleOrderDetail(_, { product: attrs }, context: any) {
    const repository = getRepository(SaleOrderDetail)
    const newSaleOrderDetail = {
      id: uuid(),
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...attrs
    }

    return await repository.save(newSaleOrderDetail)
  }
}