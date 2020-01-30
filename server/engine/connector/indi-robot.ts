import net from 'net'
import PromiseSocket from 'promise-socket'

import { logger } from '@things-factory/env'
import { Connections, Connector } from '@things-factory/integration-base'

export class IndiRobotConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('indi-robot connections are ready')
  }

  async connect(connection) {
    let socket = new PromiseSocket(new net.Socket())
    let [host, port] = connection.endpoint.split(':')
    let { timeout = 30000 } = connection.params || {}

    socket.setTimeout(Number(timeout))
    await socket.connect(port, host)
    Connections.addConnection(connection.name, socket)
  }

  async disconnect(name) {
    let socket = Connections.removeConnection(name)

    await socket.destroy()
  }

  get parameterSpec() {
    return [
      {
        type: 'number',
        label: 'timeout',
        placeholder: 'milli-seconds',
        name: 'timeout'
      }
    ]
  }
}

Connections.registerConnector('indi-robot', new IndiRobotConnector())
