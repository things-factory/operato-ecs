import gql from 'graphql-tag'

export const NewOrder = gql`
  input NewOrder {
    name: String!
    description: String
  }
`
