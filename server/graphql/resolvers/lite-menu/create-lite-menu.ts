import { getRepository } from 'typeorm'
import { LiteMenu } from '../../../entities'

export const createLiteMenu = {
  async createLiteMenu(_: any, { liteMenu }, context: any) {
    return await getRepository(LiteMenu).save({
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...liteMenu
    })
  }
}
