import { saleOrders } from './sale-orders'
import { saleOrderDetails } from './sale-order-details'

import { createSaleOrder } from './create-sale-order'
import { createSaleOrderDetail } from './create-sale-order-details'
import { splitSaleOrder } from './split-sale-order'
import { saleOrder } from './sale-order'

export const Query = {
  ...saleOrder,
  ...saleOrders,
  ...saleOrderDetails
}

export const Mutation = {
  ...createSaleOrder,
  ...createSaleOrderDetail,
  ...splitSaleOrder
}
