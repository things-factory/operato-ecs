import { getRepository } from 'typeorm'
import { Step, Scenario } from '../../../entities'

export const updateMultipleStep = {
    async updateMultipleStep(_: any, { scenarioId, patches }, context: any) {
        let results = []
        const stepRepo = getRepository(Step)
        const scenario = await getRepository(Scenario).findOne(scenarioId)
    
        for(let i = 0; i < patches.length; i++) {
          if(!patches[i].cuFlag) continue
          if (patches[i].cuFlag.toUpperCase() === '+') {
            const result = await stepRepo.save({
              ...patches[i],
              sequence: i,
              scenario,
              domain: context.state.domain,
              creator: context.state.user,
              updater: context.state.user
            })

            results.push({ ...result, cuFlag: '+' })
          } else if (patches[i].cuFlag.toUpperCase() === 'M') {
            const step = await stepRepo.findOne(patches[i].id)

            const result = await stepRepo.save({
              ...step,
              ...patches[i],
              sequence: i,
              updater: context.state.user
            })

            results.push({ ...result, cuFlag: 'M' })
          } else if (patches[i].cuFlag.toUpperCase() === '-') {
            const result = await stepRepo.delete({id: patches[i].id})

            results.push({ ...result, cuFlag: '-' })
          }
        }
      
        return results
    }
}

