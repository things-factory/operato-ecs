import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const createWorkOrder = {
  async createWorkOrder(_, { workOrder: attrs }) {
    const repository = getRepository(WorkOrder)
    const newWorkOrder = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newWorkOrder)
  }
}