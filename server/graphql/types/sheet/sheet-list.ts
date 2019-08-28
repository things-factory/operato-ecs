import { gql } from 'apollo-server-koa'

export const SheetList = gql`
  type SheetList {
    items: [Sheet]
    total: Int
  }
`
