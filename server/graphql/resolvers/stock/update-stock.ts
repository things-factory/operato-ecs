import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const updateStock = {
  async updateStock(_: any, { id, patch }, context: any) {
    const repository = getRepository(Stock)
    const stock = await repository.findOne({
      where: { domain: context.state.domain, id }
    })

    return await repository.save({
      ...stock,
      ...patch,
      updater: context.state.user
    })
  }
}
