import { Connections } from '@things-factory/integration-base'
import { TaskRegistry } from '@things-factory/integration-base'
import { MitsubishiPLCConnector } from '../connector/mitsubishi-plc'

async function plcReadWord(step, { logger }) {
  var {
    connection,
    params: { plcAddress: address, signed = false }
  } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  var deviceCode = address.substring(0, 1) + '*'
  var af_address = Number(address.substring(1)).toString()
  var len = af_address.length
  for (var i = 0; i < 6 - len; i++) {
    af_address = '0' + af_address
  }
  var readStartDevice = af_address
  var sendMessage = MitsubishiPLCConnector.getReadWordCommand(deviceCode, readStartDevice)

  await socket.write(sendMessage)
  logger.info(sendMessage)

  var response = await socket.read()
  if (!response) {
    // socket ended or closed
    throw new Error('socket closed')
  }

  var content = response.toString()

  var wordValue = content.substring(22, 26)
  var data = parseInt(wordValue, 16)

  if (signed && (data & 0x8000) > 0) {
    data -= 0x10000
  }

  logger.info(`received response is ok. received: ${data}`)

  return {
    data
  }
}

plcReadWord.parameterSpec = [
  {
    type: 'string',
    name: 'plcAddress',
    label: 'plcAddress'
  },
  {
    type: 'checkbox',
    name: 'signed',
    label: 'signed'
  }
]

TaskRegistry.registerTaskHandler('plc-read-word', plcReadWord)
