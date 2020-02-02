import { Connections, TaskRegistry } from '@things-factory/integration-base'

/* TODO Not implemented yet */
async function robot_do(step, { logger }) {
  var {
    connection,
    params: { command }
  } = step

  var socket = Connections.getConnection(connection)
  if (!socket) {
    throw new Error(`no connection : ${connection}`)
  }

  await socket.write(
    JSON.stringify({
      command,
      actionType: 'R_DO'
    })
  )

  logger.info('do command sent')
}

robot_do.parameterSpec = []

TaskRegistry.registerTaskHandler('robot_do', robot_do)
