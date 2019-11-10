import gql from 'graphql-tag'

export const Stock = gql`
  type Stock {
    id: String
    name: String
    domain: Domain
    description: String
  }
`
