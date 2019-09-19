import { gql } from 'apollo-server-koa'

export const NewStock = gql`
  input NewStock {
    name: String!
    description: String
  }
`
