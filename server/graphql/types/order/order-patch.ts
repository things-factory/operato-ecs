import { gql } from 'apollo-server-koa'

export const OrderPatch = gql`
  input OrderPatch {
    name: String
    description: String
  }
`
