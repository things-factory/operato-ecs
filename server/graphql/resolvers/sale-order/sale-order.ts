import { getRepository } from 'typeorm'
import { SaleOrder } from '../../../entities'

export const saleOrder = {
  async saleOrder(_, { id }, context: any) {
    const repository = getRepository(SaleOrder)

    // return repository.findOne({ domain: context.state.domain, id })
    return repository.findOne({ id })
  }
}