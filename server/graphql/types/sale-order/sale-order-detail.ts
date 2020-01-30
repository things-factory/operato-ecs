import gql from 'graphql-tag'

export const SaleOrderDetail = gql`
  type SaleOrderDetail {
    id: String!
    name: String
    saleOrder: SaleOrder
    product: Product
    qty: Float
    status: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
