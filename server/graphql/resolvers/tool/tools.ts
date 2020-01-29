
import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Tool } from '../../../entities'

export const toolsResolver = {
  async tools(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Tool).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}