import gql from 'graphql-tag'

export const WorkOrderList = gql`
  type WorkOrderList {
    items: [WorkOrder]
    total: Int
  }
`
