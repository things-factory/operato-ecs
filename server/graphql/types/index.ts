import * as Sheet from './sheet'
import * as Order from './order'
import * as Stock from './stock'
import * as BoardSetting from './board-setting'
import * as Connection from './connection'
import * as Scenario from './scenario'
import * as Step from './step'

export const queries = [
  Sheet.Query,
  Order.Query,
  Stock.Query,
  BoardSetting.Query,
  Connection.Query,
  Scenario.Query,
  Step.Query
]

export const mutations = [
  Sheet.Mutation,
  Order.Mutation,
  Stock.Mutation,
  Connection.Mutation,
  Scenario.Mutation,
  Step.Mutation
]

export const subscriptions = [Scenario.Subscription]

export const types = [
  ...Sheet.Types,
  ...Order.Types,
  ...Stock.Types,
  ...BoardSetting.Types,
  ...Connection.Types,
  ...Scenario.Types,
  ...Step.Types
]
