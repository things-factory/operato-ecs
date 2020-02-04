import uuid from 'uuid/v4'

import { getRepository, getManager, EntityManager } from 'typeorm'

import { ListParam, convertListParams, pubsub } from '@things-factory/shell'

import { SaleOrder, SaleOrderDetail, WorkOrder } from '../../../entities'
// import { updateSaleOrderStatus } from './update-sale-order-status'

export const splitSaleOrder = {
  async splitSaleOrder(_, { saleOrderId }, context: any) {  // params: saleOrderId: 123123
    await getManager().transaction(async (trxMgr: EntityManager) => {
      // get sale order
      let soRepo = getRepository(SaleOrder)
      var so = await soRepo.findOne({ 
        where: { id: saleOrderId },
        relations: ['domain', 'details', 'details.product', 'creator', 'updater']
      })

      if (!so) {
        return
      }

      const items = so.details

      // split
      if (!items || items.length == 0) {
        return;
      }

      let wos = []
      const repository = getRepository(WorkOrder)
      items.forEach(async sod => {
        for (let i = 0; i < sod.qty; i++) {
          let random = (Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 4)).toUpperCase()
          let soName = so.name.substring(2)
          let newWorkOrder = {
            ...sod,
            id: uuid(),
            domain: so.domain,
            name: `WO${soName}${sod.product.code}${random}`,
            status: 'INIT',
            owner: ' ',
            qty: 1,
            saleOrder: so
          }
    
          newWorkOrder.saleOrder = so

          await repository.save(newWorkOrder)
          wos.push(newWorkOrder)
        }
      });

      if (!so) {
        throw `SaleOrder:${saleOrderId} was not found`
      }

      so.status = 'STARTED'
      await soRepo.save(so)

      return so

      // this.publishData('workorder', { items: wos })
    })
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