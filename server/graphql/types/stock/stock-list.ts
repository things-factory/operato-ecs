import gql from 'graphql-tag'

export const StockList = gql`
  type StockList {
    items: [Stock]
    total: Int
  }
`
