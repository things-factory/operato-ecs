import { getRepository } from 'typeorm'
import { Order } from '../../../entities'

export const deleteOrder = {
  async deleteOrder(_, { id }) {
    const repository = getRepository(Order)

    return await repository.delete(id)
  }
}
