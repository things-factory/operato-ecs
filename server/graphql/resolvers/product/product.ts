import { getRepository } from 'typeorm'
import { Product } from '../../../entities'

export const productResolver = {
  async product(_, { id }, context, info) {
    const repository = getRepository(Product)

    repository.findOne({ domain: context.state.domain, id })
  }
}