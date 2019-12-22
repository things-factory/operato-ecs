import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_move(step, { logger }) {
  var {
    connection,
    params: { position }
  } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  await socket.write(
    JSON.stringify({
      command: '02',
      fromPosition: position,
      actionType: 'R_MOVE'
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

  var json = JSON.parse(logData)
  if (json.command == '03') {
    // ok
  } else if (json.command == '09') {
    // error
    throw new Error(`response command-'09' not applicable : ${content}`)
  } else {
    // error
    throw new Error(`invalid response : ${content}`)
  }
}

robot_move.parameterSpec = [
  {
    type: 'string',
    name: 'position',
    label: 'position'
  }
]

TaskRegistry.registerTaskHandler('robot_move', robot_move)
