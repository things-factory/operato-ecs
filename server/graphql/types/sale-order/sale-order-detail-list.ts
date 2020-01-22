import gql from 'graphql-tag'

export const SaleOrderDetailList = gql`
  type SaleOrderDetailList {
    items: [SaleOrderDetail]
    total: Int
  }
`
