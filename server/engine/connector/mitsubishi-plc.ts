import net from 'net'
import PromiseSocket from 'promise-socket'

import { logger } from '@things-factory/env'
import { Connections, Connector } from '@things-factory/integration-base'
import { sleep } from '../utils'

const subHeader = '5000'
const networkNumber = '00'
const requireNumber = 'FF'
const requireIoNumber = '03FF'
const requireMultiNumber = '00'
const readrequireLength = '0018'
const writerequireLength = '0019'
const writewordrequireLength = '001C'
const reserve = '0000'
const readCommand = '0401'
const readWordSubCommand = '0000'
const readCoilSubCommand = '0001'
const writeCommand = '1401'
const writeWordSubCommand = '0000'
const writeSubCommand = '0001'
const readLengthDevice = '0001'
const writeLengthDevice = '0001'

export class MitsubishiPLCConnector implements Connector {
  static getWriteCoilCommand(deviceCode, writeStartDevice, writeCoilValue) {
    return (
      subHeader +
      networkNumber +
      requireNumber +
      requireIoNumber +
      requireMultiNumber +
      writerequireLength +
      reserve +
      writeCommand +
      writeSubCommand +
      deviceCode +
      writeStartDevice +
      writeLengthDevice +
      writeCoilValue
    )
  }

  static getWriteWordCommand(deviceCode, writeStartDevice, writeWordValue) {
    return (
      subHeader +
      networkNumber +
      requireNumber +
      requireIoNumber +
      requireMultiNumber +
      writewordrequireLength +
      reserve +
      writeCommand +
      writeWordSubCommand +
      deviceCode +
      writeStartDevice +
      writeLengthDevice +
      writeWordValue
    )
  }

  static getReadCoilCommand(deviceCode, readStartDevice) {
    return (
      subHeader +
      networkNumber +
      requireNumber +
      requireIoNumber +
      requireMultiNumber +
      readrequireLength +
      reserve +
      readCommand +
      readCoilSubCommand +
      deviceCode +
      readStartDevice +
      readLengthDevice
    )
  }

  static getReadWordCommand(deviceCode, readStartDevice) {
    return (
      subHeader +
      networkNumber +
      requireNumber +
      requireIoNumber +
      requireMultiNumber +
      readrequireLength +
      reserve +
      readCommand +
      readWordSubCommand +
      deviceCode +
      readStartDevice +
      readLengthDevice
    )
  }

  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('mitsubishi-plc connections are ready')
  }

  async connect(connection) {
    let netsocket = new net.Socket()
    netsocket.on('error', async () => {
      logger.error('plc client error')
      sleep(10)
      await this.disconnect(connection.name)  // TODO test  // FIXME
      await this.connect(connection)
    })

    netsocket.on('end', async () => {
      // console.log('plc client end')
      logger.info('plc client end')
    })

    let socket = new PromiseSocket(netsocket)
    let [host, port] = connection.endpoint.split(':')
    let { timeout = 30000 } = connection.params || {}

    socket.setTimeout(Number(timeout))
    await socket.connect(port, host)
    Connections.addConnection(connection.name, socket)
  }

  async disconnect(name: String) {
    let socket = Connections.removeConnection(name)

    await socket.destroy()
  }

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

Connections.registerConnector('mitsubishi-plc', new MitsubishiPLCConnector())
