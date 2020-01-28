import gql from 'graphql-tag'

export const ToolList = gql`
  type ToolList {
    items: [Tool]
    total: Int
  }
`
