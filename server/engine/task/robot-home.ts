import { Connections } from '@things-factory/integration-base'
import { TaskRegistry } from '@things-factory/integration-base'

async function robot_home(step, { logger }) {
  var { connection } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  await socket.write(
    JSON.stringify({
      command: '02',
      actionType: 'R_HOME'
    })
  )

  var response = await socket.read()

  if (!response) {
    // socket ended or closed
    throw new Error('socket closed')
  }

  var content = response.toString()

  var logData = content.replace(/(\r\n|\n|\r)/g, '')
  logData = logData.replace(/(\s*)/g, '')
  logData = logData.replace(/(\0)/g, '')
  logData = logData.trim()

  logger.info(`received response : ${logData}`)

  var json = JSON.parse(logData)
  if (json.command == '05') {
    // ok
  } else if (json.command == '09') {
    // error
    throw new Error(`response command-'09' not applicable : ${content}`)
  } else {
    // error
    throw new Error(`invalid response : ${content}`)
  }
}

robot_home.parameterSpec = []

TaskRegistry.registerTaskHandler('robot_home', robot_home)
