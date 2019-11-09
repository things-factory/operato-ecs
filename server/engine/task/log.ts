import { TaskRegistry } from '../task-registry'

async function Log(step, { logger }) {
  var { message, level = 'info' } = step

  switch (level) {
    case 'error':
      logger.error(message)
      return
    case 'warn':
      logger.warn(message)
      return
    default:
      logger.info(message)
  }
}

TaskRegistry.registerTaskHandler('log', Log)
