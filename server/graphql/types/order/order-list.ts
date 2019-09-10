import { gql } from 'apollo-server-koa'

export const OrderList = gql`
  type OrderList {
    items: [Order]
    total: Int
  }
`
