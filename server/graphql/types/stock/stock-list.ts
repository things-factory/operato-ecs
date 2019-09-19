import { gql } from 'apollo-server-koa'

export const StockList = gql`
  type StockList {
    items: [Stock]
    total: Int
  }
`
