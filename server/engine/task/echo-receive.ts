import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function EchoReceive(step) {
  var { connection: connectionName, message, delay } = step

  var connection = Connections.getConnection(connectionName)

  delay && connection.setTimeout(delay)
  var message = await connection.read()

  console.log(`echo-receive : '${message.toString()}'`)
}

TaskRegistry.registerTaskHandler('echo-receive', EchoReceive)
