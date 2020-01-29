import { workOrders } from './work-orders'

import { createWorkOrder } from './create-work-order'

export const Query = {
  ...workOrders,
}

export const Mutation = {
  ...createWorkOrder,
}
