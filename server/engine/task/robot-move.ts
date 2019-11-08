import TaskRegistry from '../task-registry'
import Connections from '../connections'

async function robot_move(task) {
  var { name, ip } = task.options

  var connection = Connections.getConnection(ip)

  await connection.write(
    JSON.stringify({
      fromPosition: name,
      command: '02'
    })
  )
}

TaskRegistry.registerTaskHandler('robot_move', robot_move)
