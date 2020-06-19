import gql from 'graphql-tag'

export const LiteMenuPatch = gql`
  input LiteMenuPatch {
    name: String
    description: String
    rank: Int
    type: String
    value: String
    active: Boolean
  }
`
