import gql from 'graphql-tag'

export const SheetList = gql`
  type SheetList {
    items: [Sheet]
    total: Int
  }
`
