import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const updateWorkOrder = {
  async updateWorkOrder(_, { id, patch }, context: any) {
    const repository = getRepository(WorkOrder)

    const workorder = await repository.findOne({ id })
    if (!workorder) {
      return {}
    }

    return await repository.save({
      ...workorder,
      ...patch,
      updater: context.state.user
    })
  }
}