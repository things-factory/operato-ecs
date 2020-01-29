
import { getRepository } from 'typeorm'
import { Tool } from '../../../entities'

export const updateTool = {
  async updateTool(_, { id, patch }) {
    const repository = getRepository(Tool)

    const tool = await repository.findOne({ id })

    return await repository.save({
      ...tool,
      ...patch
    })
  }
}