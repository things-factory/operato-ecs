import { getRepository } from 'typeorm'
import { LiteMenu } from '../../../entities'

export const updateLiteMenu = {
  async updateLiteMenu(_: any, { name, patch }, context: any) {
    const repository = getRepository(LiteMenu)
    const liteMenu = await repository.findOne({
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      creater: context.state.user,
      domain: context.state.domain,
      ...liteMenu,
      ...patch,
      updater: context.state.user
    })
  }
}
