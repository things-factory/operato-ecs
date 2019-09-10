import { gql } from 'apollo-server-koa'

export const NewOrder = gql`
  input NewOrder {
    name: String!
    description: String
  }
`
