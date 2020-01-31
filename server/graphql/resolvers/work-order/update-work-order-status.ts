import { getRepository, getManager, EntityManager } from 'typeorm'
import { WorkOrder, SaleOrder } from '../../../entities'

export const updateWorkOrderStatus = {
  async updateWorkOrderStatus(_, { id, patch }, context: any) {
    await getManager().transaction(async (trxMgr: EntityManager) => {
      let woRepo = trxMgr.getRepository(WorkOrder)
      let wo = await woRepo.findOne({
        // where: { domain: context.state.domain, id },
        where: { id },
      })

      wo.status = patch.status
      woRepo.save(wo)
      
      var soRepo = trxMgr.getRepository(SaleOrder)
      let so = await soRepo.findOne({
        // where: { domain: context.state.domain, id },
        where: { id },
      })
      
      if (wo.status === 'CANCEL') {
        so.status = patch.status
        soRepo.save(so)
      } else if (wo.status === 'FINISHED') {
        wo.saleOrder.id

        let doneQty = await woRepo.createQueryBuilder('workOrder')
            .select('SUM(workOrder.qty)', "sum")
            .where("workOrder.saleOrder.id = :saleOrderId", { saleOrderId: wo.saleOrder.id })
            .andWhere("workOrder.status = :status", { status: wo.status })
            .groupBy('workOrder.saleOrder.id')
            .getRawOne();

        let so = await soRepo.findOne({
          // where: { domain: context.state.domain, id },
          where: { id },
        })

        if (doneQty >= so.qty) {
          so.status = wo.status
          soRepo.save(so)
        }
      }
    })

    // return 
  }
}