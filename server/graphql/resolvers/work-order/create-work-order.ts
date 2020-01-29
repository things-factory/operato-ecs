import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const createWorkOrder = {
  async createWorkOrder(_, { workOrder: attrs }, context: any) {
    const repository = getRepository(WorkOrder)
    const newWorkOrder = {
      id: uuid(),
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...attrs
    }

    return await repository.save(newWorkOrder)
  }
}