import gql from 'graphql-tag'

export const SaleOrderDetail = gql`
  type SaleOrderDetail {
    id: String!
    qty: Float
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
