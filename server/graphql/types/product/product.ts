import gql from 'graphql-tag'

export const Product = gql`
  type Product {
    id: String!
    domain: Domain
    code: String!
    name: String!
    description: String
    group1: String
    group2: String
    group3: String
    type: String
    active: Boolean
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
