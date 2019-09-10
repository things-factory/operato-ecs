import { Order } from './order'
import { NewOrder } from './new-order'
import { OrderPatch } from './order-patch'
import { OrderList } from './order-list'
import { Filter, Pagination, Sorting } from '@things-factory/shell'

export const Mutation = `
  createOrder (
    order: NewOrder!
  ): Order

  updateOrder (
    id: String!
    patch: OrderPatch!
  ): Order

  deleteOrder (
    id: String!
  ): Order

  publishOrder (
    id: String!
  ): Order
`

export const Query = `
  orders(filters: [Filter], pagination: Pagination, sortings: [Sorting]): OrderList
  order(id: String!): Order
`

export const Types = [Filter, Pagination, Sorting, Order, NewOrder, OrderPatch, OrderList]
