import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_run(step, { logger }) {
  var { ip } = step

  var connection = Connections.getConnection(ip)
  if (!connection) {
    throw new Error(`no connection : ${ip}`)
  }

  await connection.write(
    JSON.stringify({
      command: '02',
      actionType: 'R_RUN'
    })
  )

  logger.info('run command sent')
}

TaskRegistry.registerTaskHandler('robot_run', robot_run)
