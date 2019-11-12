import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function redis_signal(step, { logger }) {
  var { ip, redis_address: address, value, delay } = step

  var connection = Connections.getConnection(ip)
  if (!connection) {
    throw new Error(`no connection : ${ip}`)
  }

  while (value !== (await connection.get(address))) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('redis_signal', redis_signal)
