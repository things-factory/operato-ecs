import gql from 'graphql-tag'

export const StepPatch = gql`
  input StepPatch {
    id: String
    name: String
    description: String
    sequence: Int
    scenario_id: String
    task: String
    params: String
    cuFlag: String
  }
`
