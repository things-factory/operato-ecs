import * as Sheet from './sheet'
import * as Stock from './stock'
import * as BoardSetting from './board-setting'



export const queries = [
  Sheet.Query,
  Stock.Query,
  BoardSetting.Query,
]

export const mutations = [
  Sheet.Mutation,
  Stock.Mutation,
]

// export const subscriptions = [Scenario.Subscription]

export const types = [
  ...Sheet.Types,
  ...Stock.Types,
  ...BoardSetting.Types,
]
