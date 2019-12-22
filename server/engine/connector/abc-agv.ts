import { Connector } from '../types'
import { Connections } from '../connections'

export class ABCAgv implements Connector {
  ready() {
    return null
  }

  async connect(connection) {}
  async disconnect(name) {}

  get parameterSpec() {
    return [
      {
        type: 'number',
        label: 'timeout',
        placeholder: 'milli-seconds',
        name: 'timeout'
      }
    ]
  }
}

Connections.registerConnector('abc-agv', new ABCAgv())
