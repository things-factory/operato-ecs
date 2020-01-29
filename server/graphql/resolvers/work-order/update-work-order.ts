import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const updateWorkOrder = {
  async updateWorkOrder(_, { id, patch }) {
    const repository = getRepository(WorkOrder)

    const product = await repository.findOne({ id })

    return await repository.save({
      ...product,
      ...patch
    })
  }
}