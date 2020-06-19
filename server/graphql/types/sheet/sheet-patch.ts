import gql from 'graphql-tag'

export const SheetPatch = gql`
  input SheetPatch {
    name: String
    description: String
    type: String
    value: String
    active: Boolean
  }
`
