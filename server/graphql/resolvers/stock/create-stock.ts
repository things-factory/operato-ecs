import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const createStock = {
  async createStock(_: any, { stock }, context: any) {
    return await getRepository(Stock).save({
      ...stock,
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user
    })
  }
}
