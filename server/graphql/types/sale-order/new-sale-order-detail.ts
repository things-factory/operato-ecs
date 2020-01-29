import gql from 'graphql-tag'

export const NewSaleOrderDetail = gql`
  input NewSaleOrderDetail {
    qty: Float
    saleOrderId: String
    productId: String
  }
`
