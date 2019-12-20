import { logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

export class HttpConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('http-connector connections are ready')
  }

  async connect(connection) {
    Connections.addConnection(connection.name, connection)
  }

  async disconnect(name) {
    Connections.removeConnection(name)
  }

  get parameterSpec() {
    return [
      {
        type: 'string',
        label: 'username',
        name: 'username'
      },
      {
        type: 'password',
        label: 'password',
        name: 'password'
      }
    ]
  }
}

Connections.registerConnector('http-connector', new HttpConnector())
