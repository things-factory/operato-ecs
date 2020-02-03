import gql from 'graphql-tag'

export const ProductPatch = gql`
  input ProductPatch {
    id: String!
    code: String
    name: String
    description: String
    type: String
    group1: String
    group2: String
    group3: String
    active: Boolean
    cuFlag: String
  }
`
