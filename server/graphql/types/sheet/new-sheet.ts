import gql from 'graphql-tag'

export const NewSheet = gql`
  input NewSheet {
    name: String!
    description: String
    type: String
    value: String
    active: Boolean
  }
`
