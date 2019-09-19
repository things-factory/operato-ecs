import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const createStock = {
  async createStock(_, { stock: attrs }) {
    const repository = getRepository(Stock)
    const newStock = {
      id: uuid(),
      ...attrs
    }

    return await repository.save(newStock)
  }
}
