import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const scenarioResolver = {
  async scenario(_: any, { id }, context: any) {
    return await getRepository(Scenario).findOne({
      where: { domain: context.state.domain, id },
      relations: ['domain', 'steps', 'creator', 'updater']
    })
  }
}
