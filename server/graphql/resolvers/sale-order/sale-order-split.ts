import uuid from 'uuid/v4'

import { getRepository } from 'typeorm'

import { ListParam, convertListParams, pubsub } from '@things-factory/shell'

import { SaleOrder, SaleOrderDetail, WorkOrder } from '../../../entities'
import { createWorkOrder } from '../work-order/create-work-order'


export const saleOrderSplit = {
  async saleOrderSplit(_, params: ListParam, context: any) {
    // get sale order
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(SaleOrderDetail).findAndCount({
      ...convertedParams,
      relations: ['domain', 'material', 'scenario', 'updater']
    })

    // split
    if (total == 0) {
      return;
    }

    let wos = []
    const dateStr = new Date().toISOString().substring(0, 10).replace('-', '')
    items.forEach(async (so) => {
      let random = (Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)).toUpperCase()
      let wo = {
        ...so,
        name: `ORD${dateStr}${so.product.code}${random}`,
        status: 'INIT'
      }

      // create work order  // TODO TRANSACTION
      await this.createWorkOrder(wo)
      wos.push(wo)
    });

    this.publishData('workorder', { items: wos })
  },

  async createWorkOrder(wo: WorkOrder) {
    const repository = getRepository(WorkOrder)
    const newWorkOrder = {
      id: uuid(),
      ...wo
    }

    return await repository.save(newWorkOrder)
  },

  publishData(tag='workorder', data={}) {
    pubsub.publish('publish-data', {
      publishData: {
        tag,
        data
      }
    })
  }
}