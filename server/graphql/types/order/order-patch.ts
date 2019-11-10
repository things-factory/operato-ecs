import gql from 'graphql-tag'

export const OrderPatch = gql`
  input OrderPatch {
    name: String
    description: String
  }
`
