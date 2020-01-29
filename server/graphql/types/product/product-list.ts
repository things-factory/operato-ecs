import gql from 'graphql-tag'

export const ProductList = gql`
  type ProductList {
    items: [Product]
    total: Int
  }
`
