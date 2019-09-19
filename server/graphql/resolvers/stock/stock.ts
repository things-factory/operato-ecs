import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const stockResolver = {
  async stock(_, { id }, context, info) {
    const repository = getRepository(Stock)

    return await repository.findOne(
      { id }
    )
  }
}
