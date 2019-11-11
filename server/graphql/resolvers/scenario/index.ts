import { scenarioResolver } from './scenario'
import { scenariosResolver } from './scenarios'

import { updateScenario } from './update-scenario'
import { updateMultipleScenario } from './update-multiple-scenario'
import { createScenario } from './create-scenario'
import { deleteScenario } from './delete-scenario'
import { deleteScenarios } from './delete-scenarios'

export const Query = {
  ...scenariosResolver,
  ...scenarioResolver
}

export const Mutation = {
  ...updateScenario,
  ...updateMultipleScenario,
  ...createScenario,
  ...deleteScenario,
  ...deleteScenarios
}
