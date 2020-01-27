import { Connections } from '@things-factory/integration-base'
import { TaskRegistry } from '@things-factory/integration-base'
import { MitsubishiPLCConnector } from '../connector/mitsubishi-plc'

async function plcWriteWord(step, { logger }) {
  var {
    connection,
    params: { plcAddress: address, value }
  } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  var w_address = address
  var w_value = value
  var deviceCode = w_address.substring(0, 1) + '*'

  var af_address = Number(w_address.substring(1)).toString()
  var len = af_address.length
  for (var i = 0; i < 6 - len; i++) {
    af_address = '0' + af_address
  }
  var writeStartDevice = af_address

  var valueDefine = Number(value).toString(16)
  var writeWordValue = ''

  if (valueDefine.length == 1) {
    writeWordValue = '000' + Number(value).toString(16)
  } else if (valueDefine.length == 2) {
    writeWordValue = '00' + Number(value).toString(16)
  } else if (valueDefine.length == 3) {
    writeWordValue = '0' + Number(value).toString(16)
  } else if (valueDefine.length == 4) {
    writeWordValue = Number(value).toString(16)
  }

  var sendMessage = MitsubishiPLCConnector.getWriteWordCommand(deviceCode, writeStartDevice, writeWordValue)
  logger.info(sendMessage)

  await socket.write(sendMessage)
  var response = await socket.read()
  if (!response) {
    // socket ended or closed
    throw new Error('socket closed')
  }

  var content = response.toString()
  var writtenValue = content.substring(22, 26)

  logger.info(`received response: ${content}`)

  return {
    data: parseInt(writtenValue, 16)
  }
}

plcWriteWord.parameterSpec = [
  {
    type: 'string',
    name: 'plcAddress',
    placeholder: 'M0,Y1,..',
    label: 'plcAddress'
  },
  {
    type: 'number',
    name: 'value',
    label: 'value'
  }
]

TaskRegistry.registerTaskHandler('plc-write-word', plcWriteWord)
