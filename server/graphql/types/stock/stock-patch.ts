import { gql } from 'apollo-server-koa'

export const StockPatch = gql`
  input StockPatch {
    name: String
    description: String
  }
`
