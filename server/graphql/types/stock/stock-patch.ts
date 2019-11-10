import gql from 'graphql-tag'

export const StockPatch = gql`
  input StockPatch {
    name: String
    description: String
  }
`
