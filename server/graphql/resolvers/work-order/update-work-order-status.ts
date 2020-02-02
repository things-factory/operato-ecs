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
      await woRepo.save(wo)
      
      if (wo.status === 'FINISHED') {
        var soRepo = trxMgr.getRepository(SaleOrder)
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
          await soRepo.save(so)
        }
      }
    })

    // return 
  }
}