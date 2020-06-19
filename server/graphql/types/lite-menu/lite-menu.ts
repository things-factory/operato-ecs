import gql from 'graphql-tag'

export const LiteMenu = gql`
  type LiteMenu {
    id: String
    name: String
    description: String
    rank: Int
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
