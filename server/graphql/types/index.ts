import * as Sheet from './sheet'
import * as Order from './order'
import * as Stock from './stock'
import * as BoardSetting from './board-setting'


export const queries = [
  Sheet.Query,
  Order.Query,
  Stock.Query,
  BoardSetting.Query,
]

export const mutations = [
  Sheet.Mutation,
  Order.Mutation,
  Stock.Mutation,
]

// export const subscriptions = [Scenario.Subscription]

export const types = [
  ...Sheet.Types,
  ...Order.Types,
  ...Stock.Types,
  ...BoardSetting.Types,
]
