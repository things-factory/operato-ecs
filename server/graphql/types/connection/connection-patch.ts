import gql from 'graphql-tag'

export const ConnectionPatch = gql`
  input ConnectionPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
