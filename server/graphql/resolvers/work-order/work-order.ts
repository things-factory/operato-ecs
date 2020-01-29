import { getRepository } from 'typeorm'
import { WorkOrder } from '../../../entities'

export const workOrder = {
  async workOrder(_, { id }, context: any) {
    const repository = getRepository(WorkOrder)

    // return repository.findOne({ domain: context.state.domain, id })
    return repository.findOne({ id })
  }
}