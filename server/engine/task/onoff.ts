import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { MitsubishiPLCConnector } from '../connector/mitsubishi-plc'

async function onoff(step, { logger }) {
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

  if (w_value == 1) {
    var writeCoilValue = '1'
  } else {
    var writeCoilValue = '0'
  }

  var sendMessage = MitsubishiPLCConnector.getWriteCommand(deviceCode, writeStartDevice, writeCoilValue)
  logger.info(sendMessage)

  await socket.write(sendMessage)
  var response = await socket.read()
  if (!response) {
    // socket ended or closed
    throw new Error('socket closed')
  }

  var content = response.toString()

  if (content.substring(17, 18) == '4') {
    logger.info('received response.')
    // ok
  } else {
    // error
    throw new Error('response not applicable')
  }
}

TaskRegistry.registerTaskHandler('onoff', onoff)
