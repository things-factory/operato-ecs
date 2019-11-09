import net from 'net'
import PromiseSocket from 'promise-socket'

import { config } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

export class EchoBack implements Connector {
  ready(connectionConfigs) {
    const ECHO_SERVER = config.get('echoServer')

    return new Promise((resolve, reject) => {
      var server = net.createServer(socket => {
        socket.on('data', function(data) {
          console.log('Echoing: %s', data.toString())
          socket.write(data.toString())
        })
      })

      server.listen(ECHO_SERVER.port, async function() {
        console.log('Echo-back server listening on %j', server.address())

        await Promise.all(
          connectionConfigs.map(async connectionConfig => {
            let socket = new PromiseSocket(new net.Socket())
            await socket.connect(connectionConfig.port, connectionConfig.host)
            Connections.addConnection(connectionConfig.name, socket)
          })
        )

        console.log('666666778777788988', Connections.getConnections())

        resolve()
      })
    })
  }
}

Connections.registerConnector('echo-back', new EchoBack())
