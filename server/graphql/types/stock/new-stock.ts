import gql from 'graphql-tag'

export const NewStock = gql`
  input NewStock {
    name: String!
    description: String
  }
`
