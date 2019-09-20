import { getRepository } from 'typeorm'
import { Order } from '../../../entities'

export const orderResolver = {
  async order(_, { id }, context, info) {
    const repository = getRepository(Order)

    return await repository.findOne({ id })
  }
}
