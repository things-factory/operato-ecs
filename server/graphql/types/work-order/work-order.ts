import gql from 'graphql-tag'

export const WorkOrder = gql`
  type WorkOrder {
    id: String
    domain: Domain
    name: String
    qty: Float
    status: String
    saleOrder: SaleOrder
    product: Product
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
