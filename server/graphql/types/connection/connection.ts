import gql from 'graphql-tag'

export const Connection = gql`
  type Connection {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
