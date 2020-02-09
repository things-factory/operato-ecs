import { logger } from '@things-factory/env'
import { Connections, Connector } from '@things-factory/integration-base'
import net from 'net'
import * as modbus from 'jsmodbus'

export class ModbusTCPServer implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('modbus-tcp-servers are ready')
  }

  async connect(config) {
    var [host = '0.0.0.0', port = 502] = config.endpoint.split(':')

    const netServer = new net.Server()

    const server = new modbus.server.TCP(netServer)

    netServer.on('error', console.error)
    netServer.listen(port, host)

    /* default client connection */
    const clientSocket = new net.Socket()
    const client = new modbus.client.TCP(clientSocket)
    clientSocket.on('error', console.error)
    clientSocket.connect({ host: 'localhost', port })

    client['__server__'] = server

    Connections.addConnection(config.name, client)
  }

  async disconnect(name: String) {
    var client = Connections.removeConnection(name)
    var server = client['__server__']

    client.socket.end()
    server && server._server.close()
  }

  get parameterSpec() {
    return []
  }
}

Connections.registerConnector('modbus-tcp-server', new ModbusTCPServer())
