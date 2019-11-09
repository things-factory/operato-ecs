import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_run(step) {
  var { ip } = step

  var connection = Connections.getConnection(ip)

  await connection.write(
    JSON.stringify({
      command: '02'
    })
  )
}

TaskRegistry.registerTaskHandler('robot_run', robot_run)
