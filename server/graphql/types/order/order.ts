import gql from 'graphql-tag'

export const Order = gql`
  type Order {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
