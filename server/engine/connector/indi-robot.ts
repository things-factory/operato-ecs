import net from 'net'
import PromiseSocket from 'promise-socket'

import { config, logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

export class IndiRobotConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(
      connectionConfigs.map(async connectionConfig => {
        let socket = new PromiseSocket(new net.Socket())
        // socket.setTimeout(2000)
        await socket.connect(connectionConfig.port, connectionConfig.host)
        Connections.addConnection(connectionConfig.name, socket)
      })
    )

    logger.info('indi-robot connections are ready')
  }
}

Connections.registerConnector('indi-robot', new IndiRobotConnector())
