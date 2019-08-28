import { gql } from 'apollo-server-koa'

export const NewSheet = gql`
  input NewSheet {
    name: String!
    description: String
    boardId: String
    active: Boolean
  }
`
