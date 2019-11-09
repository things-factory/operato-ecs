import { Connector } from '../types'
import { Connections } from '../connections'

export class IndiRobotConnector implements Connector {
  ready() {
    return null
  }
}

Connections.registerConnector('indi-robot', new IndiRobotConnector())
