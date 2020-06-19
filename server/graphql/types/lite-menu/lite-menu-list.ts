import gql from 'graphql-tag'

export const LiteMenuList = gql`
  type LiteMenuList {
    items: [LiteMenu]
    total: Int
  }
`
