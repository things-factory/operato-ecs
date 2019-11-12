import { Scenario } from './scenario'
import { NewScenario } from './new-scenario'
import { ScenarioPatch } from './scenario-patch'
import { ScenarioList } from './scenario-list'
import { ScenarioState } from './scenario-state'

export const Mutation = `
  createScenario (
    scenario: NewScenario!
  ): Scenario

  updateScenario (
    name: String!
    patch: ScenarioPatch!
  ): Scenario

  updateMultipleScenario (
    patches: [ScenarioPatch]!
  ): [Scenario]

  deleteScenario (
    name: String!
  ): Boolean

  deleteScenarios (
    names: [String]!
  ): Boolean
`

export const Query = `
  scenarios(filters: [Filter], pagination: Pagination, sortings: [Sorting]): ScenarioList
  scenario(name: String!): Scenario
`

export const Subscription = `
  scenarioState: ScenarioState
`

export const Types = [Scenario, NewScenario, ScenarioPatch, ScenarioList, ScenarioState]
