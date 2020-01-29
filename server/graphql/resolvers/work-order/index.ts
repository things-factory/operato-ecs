import { workOrder } from './work-order'
import { workOrders } from './work-orders'

import { createWorkOrder } from './create-work-order'
import { updateWorkOrder } from './update-work-order'

export const Query = {
  ...workOrder,
  ...workOrders,
}

export const Mutation = {
  ...createWorkOrder,
  ...updateWorkOrder,
}
