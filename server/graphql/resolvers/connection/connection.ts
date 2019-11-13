import { getRepository } from 'typeorm'
import { Connection } from '../../../entities'

export const connectionResolver = {
  async connection(_: any, { name }, context: any) {
    return await getRepository(Connection).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })
  }
}

