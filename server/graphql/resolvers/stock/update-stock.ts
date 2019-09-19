import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const updateStock = {
  async updateStock(_, { id, patch }) {
    const repository = getRepository(Stock)

    const stock = await repository.findOne({ id })

    return await repository.save({
      ...stock,
      ...patch
    })
  }
}
