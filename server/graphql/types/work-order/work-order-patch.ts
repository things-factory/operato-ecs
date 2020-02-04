import gql from 'graphql-tag'

export const WorkOrderPatch = gql`
  input WorkOrderPatch {
    status: String
    owner: String
  }
`
