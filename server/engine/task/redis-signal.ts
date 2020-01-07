import { Connections } from '@things-factory/integration-base'
import { TaskRegistry } from '@things-factory/integration-base'
import { sleep } from '../utils'

async function redis_signal(step, { logger }) {
  var {
    connection,
    params: { address, value, delay }
  } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  while (value !== (await socket.get(address))) {
    await sleep(delay)
  }
}

redis_signal.parameterSpec = [
  {
    type: 'string',
    name: 'address',
    label: 'address'
  },
  {
    type: 'string',
    name: 'value',
    label: 'value'
  },
  {
    type: 'number',
    name: 'delay',
    placeholder: 'milli-seconds',
    label: 'delay'
  }
]

TaskRegistry.registerTaskHandler('redis_signal', redis_signal)
