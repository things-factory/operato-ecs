
import { getRepository } from 'typeorm'
import { Tool } from '../../../entities'

export const deleteTool = {
  async deleteTool(_, { id }) {
    const repository = getRepository(Tool)
    
    return await repository.delete(id)
  }
}