import { getRepository } from 'typeorm'
import { Stock } from '../../../entities'

export const deleteStock = {
  async deleteStock(_: any, { id }, context: any) {
    await getRepository(Stock).delete({ domain: context.state.domain, id })
    return true
  }
}
