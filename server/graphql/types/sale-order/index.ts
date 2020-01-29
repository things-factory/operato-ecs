import { SaleOrder } from './sale-order'
import { SaleOrderList } from './sale-order-list'
import { SaleOrderDetail } from './sale-order-detail'
import { SaleOrderDetailList } from './sale-order-detail-list'
import { NewSaleOrder } from './new-sale-order'
import { NewSaleOrderDetail } from './new-sale-order-detail'

import { Filter, Pagination, Sorting } from '@things-factory/shell'


export const Mutation = `
  createSaleOrder (
    saleOrder: NewSaleOrder!
  ): SaleOrder
  createSaleOrderDetail (
    saleOrderDetail: NewSaleOrderDetail!
  ): SaleOrderDetail
  saleOrderSplit (
    saleOrderId: String!
  ): SaleOrder
`

// export const Mutation = ``

export const Query = `
  saleOrderDetails(filters: [Filter], pagination: Pagination, sortings: [Sorting]): SaleOrderDetailList
  saleOrders(filters: [Filter], pagination: Pagination, sortings: [Sorting]): SaleOrderList
`

export const Types = [Filter, Pagination, Sorting, SaleOrder, SaleOrderList, SaleOrderDetail, SaleOrderDetailList, NewSaleOrder, NewSaleOrderDetail]
