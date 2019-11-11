import gql from 'graphql-tag'

export const ScenarioPatch = gql`
  input ScenarioPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
