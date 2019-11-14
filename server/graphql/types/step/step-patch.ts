import gql from 'graphql-tag'

export const StepPatch = gql`
  input StepPatch {
    id: String
    name: String
    description: String
    sequence: Int
    task: String
    params: String
    cuFlag: String
  }
`
