import gql from 'graphql-tag'

export const NewSheet = gql`
  input NewSheet {
    name: String!
    description: String
    boardId: String
    active: Boolean
  }
`
