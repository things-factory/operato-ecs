import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Scenario } from '../../../entities'

export const scenariosResolver = {
  async scenarios(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params)
    const [items, total] = await getRepository(Scenario).findAndCount({
      ...convertedParams,
      relations: ['domain', 'steps', 'creator', 'updater']
    })
    return { items, total }
  }
}
