import { logger } from '@things-factory/env'
import { Connections, Connector } from '@things-factory/integration-base'
import net from 'net'
import * as modbus from 'jsmodbus'

export class ModbusTCPConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('modbus-tcp connections are ready')
  }

  async connect(config) {
    var [host, port = 502] = config.endpoint.split(':')

    const clientSocket = new net.Socket()
    const client = new modbus.client.TCP(clientSocket)

    clientSocket.on('error', console.error)
    clientSocket.connect({ host, port })

    Connections.addConnection(config.name, client)
  }

  async disconnect(name: String) {
    var client = Connections.removeConnection(name)

    client.socket.end()
  }

  get parameterSpec() {
    return []
  }
}

Connections.registerConnector('modbus-tcp', new ModbusTCPConnector())
