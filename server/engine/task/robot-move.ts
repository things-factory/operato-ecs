import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_move(step, { logger }) {
  var { name, ip } = step

  var connection = Connections.getConnection(ip)
  if (!connection) {
    throw new Error(`no connection : ${ip}`)
  }

  await connection.write(
    JSON.stringify({
      command: '02',
      fromPosition: name,
      actionType: 'R_MOVE'
    })
  )

  var response = await connection.read()

  if (!response) {
    // socket ended or closed
    throw new Error('socket closed')
  }

  var content = response.toString()

  var logData = content.replace(/(\r\n|\n|\r)/g, '')
  logData = logData.replace(/(\s*)/g, '')
  logData = logData.replace(/(\0)/g, '')
  logData = logData.trim()

  var json = JSON.parse(logData)
  if (json.command == '03') {
    logger.info('move done.')
  } else if (json.command == '09') {
    // error
    throw new Error('response not applicable')
  }
}

TaskRegistry.registerTaskHandler('robot_move', robot_move)
