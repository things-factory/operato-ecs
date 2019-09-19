import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const deleteStock = {
  async deleteStock(_, { id }) {
    const repository = getRepository(Stock)

    return await repository.delete(id)
  }
}
