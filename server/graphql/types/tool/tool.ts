import gql from 'graphql-tag'

export const Tool = gql`
  type Tool {
    id: String!
    domain: Domain
    name: String!
    description: String
    type: String
    active: Boolean
    status: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
