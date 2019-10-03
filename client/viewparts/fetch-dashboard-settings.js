import { client } from '@things-factory/shell'
import gql from 'graphql-tag'

export async function fetchDashboardSettings() {
  var response = await client.query({
    query: gql`
      {
        boardSettings {
          name
          value
          board {
            id
            name
            description
            thumbnail
          }
        }
      }
    `
  })

  if (!response || !response.data) return
  return response.data.boardSettings
}
