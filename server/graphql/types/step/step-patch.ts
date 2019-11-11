import gql from 'graphql-tag'

export const StepPatch = gql`
  input StepPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
