import { gql } from 'apollo-server-koa'

export const Order = gql`
  type Order {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
