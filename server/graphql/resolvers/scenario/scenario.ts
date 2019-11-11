import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const scenarioResolver = {
  async scenario(_: any, { name }, context: any) {
    const repository = getRepository(Scenario)

    return await getRepository(Scenario).findOne({
      where: { domain: context.state.domain, name, relations: ['domain', 'creator', 'updater']}
    })
  }
}

