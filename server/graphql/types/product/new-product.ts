import gql from 'graphql-tag'

export const NewProduct = gql`
  input NewProduct {
    code: String!
    name: String!
    description: String
    type: String
    active: Boolean
  }
`
