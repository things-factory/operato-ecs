import { WorkOrder } from './work-order'
import { WorkOrderList } from './work-order-list'
import { NewWorkOrder } from './new-work-order'
import { Filter, Pagination, Sorting } from '@things-factory/shell'

export const Mutation = `createWorkOrder (
  workOrder: NewWorkOrder!
): WorkOrder`

// export const Mutation = ``

export const Query = `
  workOrders(filters: [Filter], pagination: Pagination, sortings: [Sorting]): WorkOrderList
  workOrder(id: String!): WorkOrder
`

export const Types = [Filter, Pagination, Sorting, WorkOrder, WorkOrderList, NewWorkOrder]