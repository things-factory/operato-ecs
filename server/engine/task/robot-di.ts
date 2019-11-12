import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_di(step, { logger }) {
  var { ip, name: command } = step

  var connection = Connections.getConnection(ip)
  if (!connection) {
    throw new Error(`no connection : ${ip}`)
  }

  await connection.write(
    JSON.stringify({
      command,
      actionType: 'R_DI'
    })
  )

  logger.info('di command sent')
}

TaskRegistry.registerTaskHandler('robot_di', robot_di)
