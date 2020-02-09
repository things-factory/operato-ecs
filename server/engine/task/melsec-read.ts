import { promisify } from 'util'
import { Connections, TaskRegistry } from '@things-factory/integration-base'

async function melsecRead(step, { logger }) {
  var {
    connection,
    params: { address }
  } = step

  var conn = Connections.getConnection(connection)
  if (!conn) {
    throw new Error(`no connection : ${connection}`)
  }

  conn.addItems(address)
  var response = await promisify(conn.readAllItems).apply(conn)

  logger.info(`${JSON.stringify(response)}`)
  return {
    data: response
  }
}

melsecRead.parameterSpec = [
  {
    type: 'string',
    name: 'address',
    label: 'address'
  }
]

TaskRegistry.registerTaskHandler('melsec-read', melsecRead)
