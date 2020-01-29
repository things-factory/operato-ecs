
import { getRepository } from 'typeorm'
import { Tool } from '../../../entities'

export const toolResolver = {
  async tool(_, { id }, context, info) {
    const repository = getRepository(Tool)

    repository.findOne({ domain: context.state.domain, id })
  }
}