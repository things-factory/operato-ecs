import gql from 'graphql-tag'

export const OrderList = gql`
  type OrderList {
    items: [Order]
    total: Int
  }
`
