import gql from 'graphql-tag'

export const SheetPatch = gql`
  input SheetPatch {
    name: String
    description: String
    boardId: String
    active: Boolean
  }
`
