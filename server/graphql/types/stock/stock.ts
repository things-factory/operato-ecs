import { gql } from 'apollo-server-koa'

export const Stock = gql`
  type Stock {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
