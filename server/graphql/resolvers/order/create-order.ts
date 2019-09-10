import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Order } from '../../../entities'

export const createOrder = {
  async createOrder(_, { order: attrs }) {
    const repository = getRepository(Order)
    const newOrder = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newOrder)
  }
}
