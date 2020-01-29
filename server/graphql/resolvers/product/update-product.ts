import { getRepository } from 'typeorm'
import { Product } from '../../../entities'

export const updateProduct = {
  async updateProduct(_, { id, patch }) {
    const repository = getRepository(Product)

    const product = await repository.findOne({ id })

    return await repository.save({
      ...product,
      ...patch
    })
  }
}