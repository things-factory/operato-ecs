import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Product } from '../../../entities'

export const createProduct = {
  async createProduct(_, { product: attrs }) {
    const repository = getRepository(Product)
    const newProduct = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newProduct)
  }
}