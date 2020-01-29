
import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'
import { Tool } from '../../../entities'

export const createTool = {
  async createTool(_, { tool: attrs }, context: any) {
    const repository = getRepository(Tool)
    const newTool = {
      id: uuid(),
      domain: context.state.domain,
      creator: context.state.user,
      updater: context.state.user,
      ...attrs
    }

    return await repository.save(newTool)
  }
}