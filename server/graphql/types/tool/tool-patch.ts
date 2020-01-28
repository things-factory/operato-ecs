import gql from 'graphql-tag'

export const ToolPatch = gql`
  input ToolPatch {
    id: String
    name: String!
    description: String
    cycleCount: Float
    type: String
    status: String
    active: Boolean
    cuFlag: String
  }
`
