import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'

export const sheetResolver = {
  async sheet(_: any, { name }, context: any) {
    const repository = getRepository(Sheet)

    return await getRepository(Sheet).findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'board', 'creator', 'updater'] }
    })
  }
}
