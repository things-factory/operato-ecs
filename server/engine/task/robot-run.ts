import { TaskRegistry } from '../task-registry'
import { Connections } from '../connections'

async function robot_run(step, { logger }) {
  var { connection } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  await socket.write(
    JSON.stringify({
      command: '02',
      actionType: 'R_RUN'
    })
  )

  logger.info('run command sent')
}

robot_run.parameterSpec = []

TaskRegistry.registerTaskHandler('robot_run', robot_run)
