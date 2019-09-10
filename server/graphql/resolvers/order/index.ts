import { orderResolver } from './order'
import { ordersResolver } from './orders'

import { updateOrder } from './update-order'
import { createOrder } from './create-order'
import { deleteOrder } from './delete-order'

export const Query = {
  ...ordersResolver,
  ...orderResolver
}

export const Mutation = {
  ...updateOrder,
  ...createOrder,
  ...deleteOrder
}
