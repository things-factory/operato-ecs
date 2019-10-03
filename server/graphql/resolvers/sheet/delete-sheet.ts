import { getRepository } from 'typeorm'
import { Sheet } from '../../../entities'

export const deleteSheet = {
  async deleteSheet(_: any, { name }, context: any) {
    await getRepository(Sheet).delete({ domain: context.state.domain, name })
    return true
  }
}
