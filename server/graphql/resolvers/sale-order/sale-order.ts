import { getRepository } from 'typeorm'
import { SaleOrder } from '../../../entities'

export const saleOrder = {
  async saleOrder(_, { id }, context: any) {
    var saleOrder = await getRepository(SaleOrder).findOne({
      // where: { domain: context.state.domain, id },
      where: { id },
      relations: ['domain', 'details', 'details.product', 'creator', 'updater']
    })
    
    return saleOrder
  }
}