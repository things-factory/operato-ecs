import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function EchoSend(step) {
  var { connection: connectionName, message, delay } = step

  var connection = Connections.getConnection(connectionName)
  if (!connection) {
    throw Error(`connection is not found : ${connectionName}`)
  }

  await connection.write(message)

  console.log('echo-send : ', message)

  if (delay) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('echo-send', EchoSend)
