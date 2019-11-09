import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_di(step) {
  var { ip, name: command } = step

  var connection = Connections.getConnection(ip)

  await connection.write(
    JSON.stringify({
      command
    })
  )
}

TaskRegistry.registerTaskHandler('robot_di', robot_di)
