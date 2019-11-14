import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { MitsubishiPLCConnector } from '../connector/mitsubishi-plc'

async function watching(step, { logger }) {
  var { ip, plcAddress: address, value, delay } = step

  var connection = Connections.getConnection(ip)
  if (!connection) {
    throw new Error(`no connection : ${ip}`)
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
    await connection.write(sendMessage)
    logger.info(sendMessage)

    var response = await connection.read()
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

TaskRegistry.registerTaskHandler('watching', watching)
