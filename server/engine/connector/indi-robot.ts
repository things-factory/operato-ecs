import net from 'net'
import PromiseSocket from 'promise-socket'

import { logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

export class IndiRobotConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('indi-robot connections are ready')
  }

  async connect(connection) {
    let socket = new PromiseSocket(new net.Socket())
    let [host, port] = connection.endpoint.split(':')

    // socket.setTimeout(10000)
    await socket.connect(port, host)
    Connections.addConnection(connection.name, socket)
  }
}

Connections.registerConnector('indi-robot', new IndiRobotConnector())
