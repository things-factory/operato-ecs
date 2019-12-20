import gql from 'graphql-tag'
import './object-type'

export const PropertySpec = gql`
  scalar Object

  type PropertySpec {
    type: String!
    label: String!
    name: String!
    property: Object
  }
`
