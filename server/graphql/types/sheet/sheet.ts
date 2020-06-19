import gql from 'graphql-tag'

export const Sheet = gql`
  type Sheet {
    id: String
    name: String
    description: String
    type: String
    value: String
    board: Board
    active: Boolean
    domain: Domain
    createdAt: String
    creator: User
    updatedAt: String
    updater: User
  }
`
