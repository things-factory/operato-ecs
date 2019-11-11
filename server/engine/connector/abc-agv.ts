import { Connector } from '../types'
import { Connections } from '../connections'

export class ABCAgv implements Connector {
  ready() {
    return null
  }
}

Connections.registerConnector('abc-agv', new ABCAgv())
