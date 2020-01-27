import { Connections } from '@things-factory/integration-base'
import { TaskRegistry } from '@things-factory/integration-base'
import { MitsubishiPLCConnector } from '../connector/mitsubishi-plc'

async function plcWriteCoil(step, { logger }) {
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

  var sendMessage = MitsubishiPLCConnector.getWriteCoilCommand(deviceCode, writeStartDevice, writeCoilValue)
  logger.info(sendMessage)

  await socket.write(sendMessage)
  var response = await socket.read()
  if (!response) {
    // socket ended or closed
    throw new Error('socket closed')
  }

  var content = response.toString()
  logger.info(`received response : ${content}`)

  if (content.substring(17, 18) == '4') {
    // ok
    return {
      data: content.substring(22, 23)
    }
  } else {
    // error
    throw new Error('response not applicable')
  }
}

plcWriteCoil.parameterSpec = [
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

TaskRegistry.registerTaskHandler('plc-write-coil', plcWriteCoil)
/* DEPRECATED 'onoff' 태스크는 deprecated 되었으므로, 'plc-write-coil' 을 사용할 것. */
TaskRegistry.registerTaskHandler('onoff', plcWriteCoil)
