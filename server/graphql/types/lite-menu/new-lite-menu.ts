import gql from 'graphql-tag'

export const NewLiteMenu = gql`
  input NewLiteMenu {
    name: String!
    description: String
    rank: Int
    type: String
    value: String
    active: Boolean
  }
`
