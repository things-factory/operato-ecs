import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'

export const deleteSheet = {
  async deleteSheet(_: any, { name }, context: any) {
    await getRepository(Sheet).delete({ domain: context.domain, name })
    return true
  }
}

