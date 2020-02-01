import uuid from 'uuid/v4'

import { getRepository, getManager, EntityManager } from 'typeorm'
import { SaleOrder, SaleOrderDetail, WorkOrder } from '../../../entities'
import { ORDER_STATE } from '../../types/types'

export const updateSaleOrderStatus = {
  async updateSaleOrderStatus(_, { id, patch }, context: any) {
    await getManager().transaction(async (trxMgr: EntityManager) => {
      let soRepo = trxMgr.getRepository(SaleOrder)
      let so = await soRepo.findOne({
        // where: { domain: context.state.domain, id },
        where: { id },
        // relations: ['domain', 'details', 'details.product', 'creator', 'updater']
      })
      so.status = patch.status
      await soRepo.save(so)
      
      // if (so.status == ORDER_STATE.CANCELED) {
      if (so.status == 'CANCELED') {
        // update sod status
        let sodRepo = trxMgr.getRepository(SaleOrderDetail)
        let [sods, sodTotal] = await sodRepo.findAndCount({
          // where: { domain: context.state.domain, id },
          where: { id },
        })
        sods.forEach(async (sod) => {
          sod.status = patch.status
          await sodRepo.save(sod)
        })

        // update wo status
        let woRepo = trxMgr.getRepository(WorkOrder)
        let [wos, woTotal] = await woRepo.findAndCount({
          // where: { domain: context.state.domain, id },
          where: { id },
          // relations: ['domain', 'details', 'details.product', 'creator', 'updater']
        })

        wos.forEach(async (wo) => {
          wo.status = patch.status
          await woRepo.save(wo)
        })
      }
    })

    return
  }
}