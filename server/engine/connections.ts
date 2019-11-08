export default class Connections {
  static connectors = {}
  static connections = {}

  static registerConnector(type, connector) {
    Connections.connectors[type] = connector
  }

  static getConnector(type) {
    return Connections.connectors[type]
  }

  static unregisterConnector(type) {
    delete Connections.connectors[type]
  }

  static getConnection(name) {
    return Connections.connections[name]
  }

  static addConnection(name, connection) {
    Connections.connections[name] = connection
  }

  static removeConnection(name) {
    delete Connections.connections[name]
  }
}
