import { promisify } from 'util'
import { Connections, TaskRegistry } from '@things-factory/integration-base'

async function melsecWrite(step, { logger }) {
  var {
    connection,
    params: { address, value }
  } = step

  var conn = Connections.getConnection(connection)
  if (!conn) {
    throw new Error(`no connection : ${connection}`)
  }

  await promisify(conn.writeItems).apply(conn, [address, value])
  return {
    data: value
  }
}

melsecWrite.parameterSpec = [
  {
    type: 'string',
    name: 'address',
    label: 'address'
  },
  {
    type: 'string',
    name: 'value',
    label: 'value'
  }
]

TaskRegistry.registerTaskHandler('melsec-write', melsecWrite)
