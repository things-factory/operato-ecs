import { getRepository } from 'typeorm'
import { Order } from '../../../entities'

export const updateOrder = {
  async updateOrder(_, { id, patch }) {
    const repository = getRepository(Order)

    const order = await repository.findOne({ id })

    return await repository.save({
      ...order,
      ...patch
    })
  }
}
