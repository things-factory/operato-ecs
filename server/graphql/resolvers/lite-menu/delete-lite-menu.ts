import { getRepository } from 'typeorm'
import { LiteMenu } from '../../../entities'

export const deleteLiteMenu = {
  async deleteLiteMenu(_: any, { name }, context: any) {
    await getRepository(LiteMenu).delete({ domain: context.state.domain, name })
    return true
  }
}
