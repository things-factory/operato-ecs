import gql from 'graphql-tag'

export const Scenario = gql`
  type Scenario {
    id: String
    name: String
    domain: Domain
    description: String
    active: Boolean
    status: Number
    steps: StepList
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
