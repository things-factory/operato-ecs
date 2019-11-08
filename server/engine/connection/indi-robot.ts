import Connector from '../connector'
import Connections from '../connections'

export default class IndiRobotConnector implements Connector {
  initialize() {}
}

Connections.registerConnector('indi-robot', IndiRobotConnector)
