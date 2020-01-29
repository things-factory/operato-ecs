import gql from 'graphql-tag'

export const ProductPatch = gql`
  input ProductPatch {
    id: String!
    code: String
    name: String
    description: String
    type: String
    active: Boolean
    cuFlag: String
  }
`
