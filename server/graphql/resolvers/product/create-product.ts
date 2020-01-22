import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Product } from '../../../entities'

export const createProduct = {
  async createProduct(_, { product: attrs }, context: any) {
    const repository = getRepository(Product)
    const newProduct = {
      id: uuid(),
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...attrs
    }

    return await repository.save(newProduct)
  }
}