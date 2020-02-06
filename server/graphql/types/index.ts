import * as Sheet from './sheet'
import * as BoardSetting from './board-setting'

export const queries = [
  Sheet.Query,
  BoardSetting.Query,
]

export const mutations = [
  Sheet.Mutation,
]

// export const subscriptions = [Scenario.Subscription]

export const types = [
  ...Sheet.Types,
  ...BoardSetting.Types,
]
