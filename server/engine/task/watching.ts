import { Connections } from '@things-factory/integration-base'
import { TaskRegistry } from '@things-factory/integration-base'
import { sleep } from '../utils'
import { MitsubishiPLCConnector } from '../connector/mitsubishi-plc'

async function watching(step, { logger }) {
  var {
    connection,
    params: { plcAddress: address, value, delay }
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
  var sendMessage = MitsubishiPLCConnector.getReadCommand(deviceCode, readStartDevice)

  while (true) {
    await socket.write(sendMessage)
    logger.info(sendMessage)

    var response = await socket.read()
    if (!response) {
      // socket ended or closed
      throw new Error('socket closed')
    }

    var content = response.toString()

    if (content.substring(17, 18) == '5') {
      var coilValue = content.substring(22, 23)

      if (value == coilValue) {
        logger.info('received response is ok. required: %s, received: %s', value, coilValue)
        break
      } else {
        logger.info('received response, but not accepted. required: %s, received: %s', value, coilValue)
        await sleep(delay)
        continue
      }
    } else {
      // error
      throw new Error('response not applicable')
    }
  }
}

watching.parameterSpec = [
  {
    type: 'string',
    name: 'plcAddress',
    label: 'plcAddress'
  },
  {
    type: 'string',
    name: 'value',
    label: 'value'
  },
  {
    type: 'number',
    name: 'delay',
    placeholder: 'milli-seconds',
    label: 'delay'
  }
]

TaskRegistry.registerTaskHandler('watching', watching)
