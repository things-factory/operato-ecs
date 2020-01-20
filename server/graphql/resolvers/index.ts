import * as Sheet from './sheet'
import * as Stock from './stock'
import * as BoardSetting from './board-setting'
import * as Product from './product'
import * as SaleOrder from './sale-order'
import * as WorkOrder from './work-order'


export const queries = [
  Sheet.Query,
  Stock.Query,
  BoardSetting.Query,
  Product.Query,
  SaleOrder.Query,
  WorkOrder.Query
]

export const mutations = [
  Sheet.Mutation,
  Stock.Mutation,
  Product.Mutation,
  SaleOrder.Mutation,
  WorkOrder.Mutation
]

// export const subscriptions = [Scenario.Subscription]
