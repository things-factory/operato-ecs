import gql from 'graphql-tag'

export const NewStep = gql`
  input NewStep {
    name: String!
    description: String
  }
`
