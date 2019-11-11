import { getRepository, In } from 'typeorm'
import { Scenario } from '../../../entities'

export const deleteScenarios = {
  async deleteScenarios(_: any, { names }, context: any) {
    await getRepository(Scenario).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}

