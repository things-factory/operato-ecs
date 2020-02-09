import MCProtocol from 'mcprotocol'
import { promisify } from 'util'

import { logger } from '@things-factory/env'
import { Connections, Connector } from '@things-factory/integration-base'

export class MelsecConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('melsec-connector connections are ready')
  }

  async connect(connection) {
    var [host, port] = connection.endpoint.split(':')
    var { ascii = false } = connection.params

    try {
      var conn = new MCProtocol()
      await promisify(conn.initiateConnection).apply(conn, [
        {
          port: Number(port),
          host,
          ascii
        }
      ])

      Connections.addConnection(connection.name, conn)
    } catch (e) {
      logger.error(e)
    }
  }

  async disconnect(name: String) {
    let conn = Connections.removeConnection(name)

    await conn.dropConnection()
  }

  get parameterSpec() {
    return [
      {
        type: 'checkbox',
        label: 'ascii',
        name: 'ascii'
      }
    ]
  }
}

Connections.registerConnector('melsec-connector', new MelsecConnector())
