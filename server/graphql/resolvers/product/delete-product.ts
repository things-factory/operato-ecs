import { getRepository } from 'typeorm'
import { Product } from '../../../entities'

export const deleteProduct = {
  async deleteProduct(_, { id }) {
    const repository = getRepository(Product)
    
    return await repository.delete(id)
  }
}