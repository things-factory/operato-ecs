import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const cancelWorkOrder = {
  async cancelWorkOrder(_, { id, patch }) {
    const repository = getRepository(WorkOrder)

    const product = await repository.findOne({ id })

    return await repository.save({
      ...product,
      status: 'CANCELED'
    })
  }
}