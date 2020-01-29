import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'

import { ListParam, convertListParams, pubsub } from '@things-factory/shell'

import { SaleOrder, SaleOrderDetail, WorkOrder } from '../../../entities'

export const saleOrderSplit = {
  async saleOrderSplit(_, { saleOrderId }, context: any) {  // params: saleOrderId: 123123
    // get sale order
    var params = {
      saleOrderId,
      status: 'INIT'
    }
    const [items, total] = await getRepository(SaleOrderDetail).findAndCount({
      ...params,
      relations: ['domain', 'saleOrder', 'product', 'updater']
    })

    // split
    if (total == 0) {
      return;
    }

    let wos = []
    const repository = getRepository(WorkOrder)
    items.forEach(async sod => {
      for (let i = 0; i < sod.qty; i++) {
        let random = (Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 4)).toUpperCase()
        let soName = sod.saleOrder.name.substring(2)
        let wo = {
          ...sod,
          name: `WO${soName}${sod.product.code}${random}`,
          status: 'INIT',
          qty: 1
        }
  
        // create work order  // TODO TRANSACTION
        let newWorkOrder = {
          ...wo,
          id: uuid(),
        }
  
        await repository.save(newWorkOrder)
        wos.push(newWorkOrder)
      }
    });

    // this.publishData('workorder', { items: wos })
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