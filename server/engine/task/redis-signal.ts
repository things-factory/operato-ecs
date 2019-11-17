import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function redis_signal(step, { logger }) {
  var { connection, redis_address: address, value, delay } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  while (value !== (await socket.get(address))) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('redis_signal', redis_signal)
