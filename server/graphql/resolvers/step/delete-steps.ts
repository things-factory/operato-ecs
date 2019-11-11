import { getRepository, In } from 'typeorm'
import { Step } from '../../../entities'

export const deleteSteps = {
  async deleteSteps(_: any, { names }, context: any) {
    await getRepository(Step).delete({ 
        domain: context.state.domain,
        name: In(names)
    })
    return true
  }
}

