import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'

import { ListParam, convertListParams, pubsub } from '@things-factory/shell'

import { SaleOrder, SaleOrderDetail, WorkOrder } from '../../../entities'

export const saleOrderSplit = {
  async saleOrderSplit(_, params: ListParam, context: any) {  // params: saleOrderId: 123123
    // get sale order
    var convertedParams = convertListParams(params, context.state.domain.id)
    convertedParams = {
      ...convertedParams,
      status: 'INIT'
    }
    const [items, total] = await getRepository(SaleOrderDetail).findAndCount({
      ...convertedParams,
      relations: ['domain', 'material', 'scenario', 'updater']
    })

    // split
    if (total == 0) {
      return;
    }

    let wos = []
    items.forEach(async (sod) => {
      let random = (Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 4)).toUpperCase()
      let soName = sod.saleOrder.name.substring(2)
      let wo = {
        ...sod,
        name: `WO${soName}${sod.product.code}${random}`,
        status: 'INIT',
        qty: 1
      }

      // create work order  // TODO TRANSACTION
      await this.createWorkOrder(wo)
      wos.push(wo)
    });

    // this.publishData('workorder', { items: wos })
  },

  async createWorkOrder(wo: WorkOrder) {
    const repository = getRepository(WorkOrder)
    const newWorkOrder = {
      id: uuid(),
      ...wo
    }

    return await repository.save(newWorkOrder)
  },

  // publishData(tag='workorder', data={}) {
  //   pubsub.publish('publish-data', {
  //     publishData: {
  //       tag,
  //       data
  //     }
  //   })
  // }
}