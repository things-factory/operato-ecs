import gql from 'graphql-tag'

export const NewWorkOrder = gql`
  input NewWorkOrder {
    name: String
    qty: Float
    status: String
    saleOrderId: String
  }
`
