import * as Sheet from './sheet'
import * as Stock from './stock'
import * as BoardSetting from './board-setting'
import * as Product from './product'
import * as SaleOrder from './sale-order'
import * as WorkOrder from './work-order'
import * as Tool from './tool'


export const queries = [
  Sheet.Query,
  Stock.Query,
  BoardSetting.Query,
  Product.Query,
  SaleOrder.Query,
  WorkOrder.Query,
  Tool.Query,
]

export const mutations = [
  Sheet.Mutation,
  Stock.Mutation,
  Product.Mutation,
  SaleOrder.Mutation,
  WorkOrder.Mutation,
  Tool.Mutation,
]

// export const subscriptions = [Scenario.Subscription]

export const types = [
  ...Sheet.Types,
  ...Stock.Types,
  ...BoardSetting.Types,
  ...Product.Types,
  ...SaleOrder.Types,
  ...WorkOrder.Types,
  ...Tool.Types,
]
