import { logger } from '@things-factory/env'
import { Connections, Connector } from '@things-factory/integration-base'
import { Network } from 'escpos'

export class NetworkDevice implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('network-devices are ready')
  }

  async connect(connection) {
    /* 
      TODO escpos 모듈의 device adapter 호환 connection을 사용하고 있으나, connection 명세를 별도로 정의해서 제공하도록 해야한다.
    */
    var [address, port] = connection.endpoint.split(':')
    const device = new Network(address, port)

    Connections.addConnection(connection.name, device)
  }

  async disconnect(name) {
    let device = Connections.removeConnection(name)

    await device.close()
  }
}

Connections.registerConnector('network-device', new NetworkDevice())
