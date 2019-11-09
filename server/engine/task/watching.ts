import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { HitachiPLCConnector } from '../connector/hitachi-plc'

async function watching(step) {
  var { ip, plcAddress: address, value, delay } = step

  var connection = Connections.getConnection(ip)

  var deviceCode = address.substring(0, 1) + '*'
  var af_address = Number(address.substring(1)).toString()
  var len = af_address.length
  for (var i = 0; i < 6 - len; i++) {
    af_address = '0' + af_address
  }
  var readStartDevice = af_address
  var sendMessage = HitachiPLCConnector.getReadCommand(deviceCode, readStartDevice)

  await connection.write(sendMessage)

  if (delay) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('watching', watching)
