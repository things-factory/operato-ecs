import gql from 'graphql-tag'

export const SaleOrderList = gql`
  type SaleOrderList {
    items: [SaleOrder]
    total: Int
  }
`
