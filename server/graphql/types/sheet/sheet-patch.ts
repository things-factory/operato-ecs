import { gql } from 'apollo-server-koa'

export const SheetPatch = gql`
  input SheetPatch {
    name: String
    description: String
    boardId: String
    active: Boolean
  }
`
