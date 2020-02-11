import { Connections, Connector } from '@things-factory/integration-base'
import net from 'net'
import * as modbus from 'jsmodbus'

export class ModbusTCPConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('modbus-tcp connections are ready')
  }

  async connect(config) {
    var [host, port = 502] = config.endpoint.split(':')

    const clientSocket = new net.Socket()
    const client = new modbus.client.TCP(clientSocket)

    clientSocket.on('error', console.error)
    clientSocket.connect({ host, port })

    Connections.addConnection(config.name, client)

    Connections.logger.info(`modbus-tcp connection(${config.name}:${config.endpoint}) is connected`)
  }

  async disconnect(name: String) {
    var client = Connections.removeConnection(name)

    client.socket.end()

    Connections.logger.info(`modbus-tcp connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return []
  }
}

Connections.registerConnector('modbus-tcp', new ModbusTCPConnector())
