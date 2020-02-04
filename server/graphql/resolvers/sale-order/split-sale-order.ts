import uuid from 'uuid/v4'

import { getRepository, getManager, EntityManager } from 'typeorm'

import { ListParam, convertListParams, pubsub } from '@things-factory/shell'

import { SaleOrder, SaleOrderDetail, WorkOrder } from '../../../entities'
// import { updateSaleOrderStatus } from './update-sale-order-status'

export const splitSaleOrder = {
  async splitSaleOrder(_, { saleOrderId }, context: any) {  // params: saleOrderId: 123123
    await getManager().transaction(async (trxMgr: EntityManager) => {
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
            owner: ' ',
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

      // update so.status = 'STARTED'
      let soRepo = getRepository(SaleOrder)
      let so = await soRepo.findOne({
        // where: { domain: context.state.domain, id },
        where: { id: saleOrderId },
        relations: ['domain', 'details', 'details.product', 'creator', 'updater']
      })

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