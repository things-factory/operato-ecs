import { Connections, TaskRegistry } from '@things-factory/integration-base'

/* TODO Not implemented yet */
async function robot_di(step, { logger }) {
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
      actionType: 'R_DI'
    })
  )

  logger.info('di command sent')
}

robot_di.parameterSpec = []

TaskRegistry.registerTaskHandler('robot_di', robot_di)
