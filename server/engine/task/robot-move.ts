import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_move(step) {
  var { name, ip } = step

  var connection = Connections.getConnection(ip)

  await connection.write(
    JSON.stringify({
      fromPosition: name,
      command: '02'
    })
  )
}

TaskRegistry.registerTaskHandler('robot_move', robot_move)
