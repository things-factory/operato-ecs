import gql from 'graphql-tag'

export const Step = gql`
  type Step {
    id: String
    name: String
    domain: Domain
    description: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
