import gql from 'graphql-tag'

export const SaleOrder = gql`
  type SaleOrder {
    id: String
    domain: Domain
    name: String!
    description: String
    qty: Float
    status: String
    details: [SaleOrderDetail]
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
