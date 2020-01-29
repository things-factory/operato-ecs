import { getRepository } from 'typeorm'
import { Product } from '../../../entities'

export const productResolver = {
  async product(_, { id }, context, info) {
    const repository = getRepository(Product)

    return repository.findOne({ domain: context.state.domain, id })
  }
}