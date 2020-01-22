import gql from 'graphql-tag'

export const NewSaleOrder = gql`
  input NewSaleOrder {
    name: String!
    description: String
    qty: String
    status: String
  }
`
