import net from 'net'
import PromiseSocket from 'promise-socket'

import { logger } from '@things-factory/env'
import { Connector } from '../types'
import { Connections } from '../connections'

const subHeader = '5000'
const networkNumber = '00'
const requireNumber = 'FF'
const requireIoNumber = '03FF'
const requireMultiNumber = '00'
const readrequireLength = '0018'
const writerequireLength = '0019'
const reserve = '0000'
const readCommand = '0401'
const readSubCommand = '0001'
const writeCommand = '1401'
const writeSubCommand = '0001'
const readLengthDevice = '0001'
const writeLengthDevice = '0001'

export class MitsubishiPLCConnector implements Connector {
  static getWriteCommand(deviceCode, writeStartDevice, writeCoilValue) {
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

  static getReadCommand(deviceCode, readStartDevice) {
    return (
      subHeader +
      networkNumber +
      requireNumber +
      requireIoNumber +
      requireMultiNumber +
      readrequireLength +
      reserve +
      readCommand +
      readSubCommand +
      deviceCode +
      readStartDevice +
      readLengthDevice
    )
  }

  async ready(connectionConfigs) {
    await Promise.all(
      connectionConfigs.map(async connectionConfig => {
        let socket = new PromiseSocket(new net.Socket())
        // socket.setTimeout(2000)
        await socket.connect(connectionConfig.port, connectionConfig.host)
        Connections.addConnection(connectionConfig.name, socket)
      })
    )

    logger.info('mitsubishi-plc connections are ready')
  }
}

Connections.registerConnector('mitsubishi-plc', new MitsubishiPLCConnector())
