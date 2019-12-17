import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const stockResolver = {
  async stock(_: any, { id }, context: any, info: any) {
    return await getRepository(Stock).findOne({
      where: { domain: context.state.domain, id },
      relations: ['domain', 'scenario', 'creator', 'updater']
    })
  }
}
