import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'
import { HitachiPLCConnector } from '../connector/hitachi-plc'

async function onoff(task) {
  var { ip, plcAddress: address, value, delay } = task.options

  var connection = Connections.getConnection(ip)

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

  var sendMessage = HitachiPLCConnector.getWriteCommand(deviceCode, writeStartDevice, writeCoilValue)
  console.log(sendMessage)

  await connection.write(sendMessage)

  if (delay) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('onoff', onoff)
