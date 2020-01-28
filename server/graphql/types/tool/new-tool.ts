import gql from 'graphql-tag'

export const NewTool = gql`
  input NewTool {
    name: String!
    description: String
    cycleCount: Float
    type: String
    active: Boolean
    status: String
  }
`
