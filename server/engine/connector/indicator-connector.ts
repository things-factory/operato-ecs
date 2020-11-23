import { Connections, Connector } from '@things-factory/integration-base'

import mqtt from 'async-mqtt'

export class IndicatorConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('indicator-connector connections are ready')
  }

  async connect(connection) {
    const { endpoint: uri } = connection

    try {
      const client = await mqtt.connectAsync(uri, {
        keepalive: 10,
        clientId: 'C'+ Math.round(Math.random() * 1000000000000),
        // protocolId: "MQTT",
        // protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        // will: {
        //   topic: topic,
        //   payload: "Connection Closed abnormally..!",
        //   qos: 0,
        //   retain: false
        // },
        // username: 'dd05:admin',
        // password: 'admin',
        // rejectUnauthorized: false
      })

      Connections.addConnection(connection.name, {
        client,
        connection
      })

      Connections.logger.info(`indicator-connector connection(${connection.name}:${connection.endpoint}) is connected`)
    } catch (err) {
      Connections.logger.error(`indicator-connector connection(${connection.name}:${connection.endpoint}) is failed`, err)
    }
  }

  async disconnect(name) {
    const { client } = Connections.removeConnection(name)

    client && (await client.end())
  }

  get parameterSpec() {
    return []
  }

  get taskPrefixes() {
    return ['indicator']
  }
}

Connections.registerConnector('indicator-connector', new IndicatorConnector())
