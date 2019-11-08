import { sleep } from '@things-factory/shell'
import TaskRegistry from '../task-registry'
import Connections from '../connections'

async function redis_signal(task) {
  var { ip, redis_address: address, value, delay } = task.options

  var connection = Connections.getConnection(ip)

  while (value !== (await connection.get(address))) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('redis_signal', redis_signal)
