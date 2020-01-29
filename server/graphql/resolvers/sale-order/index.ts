import { saleOrders } from './sale-orders'
import { saleOrderDetails } from './sale-order-details'

import { createSaleOrder } from './create-sale-order'
import { createSaleOrderDetail } from './create-sale-order-details'
import { saleOrderSplit } from './sale-order-split'

export const Query = {
  ...saleOrders,
  ...saleOrderDetails
}

export const Mutation = {
  ...createSaleOrder,
  ...createSaleOrderDetail,
  ...saleOrderSplit
}
