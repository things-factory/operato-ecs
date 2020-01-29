import { buildQuery, ListParam } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Product } from '../../../entities'

export const productsResolver = {
  async products(_: any, params: ListParam, context: any) {
    const queryBuilder = getRepository(Product).createQueryBuilder()
    buildQuery(queryBuilder, params, context)
    const [items, total] = await queryBuilder.getManyAndCount()

    return { items, total }
  }
}