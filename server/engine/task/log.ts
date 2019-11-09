import { TaskRegistry } from '../task-registry'

async function Log(step) {
  var { message, level = 'log' } = step

  switch (level) {
    case 'error':
      console.error(message)
      return
    case 'warn':
      console.warn(message)
      return
    default:
      console.log(message)
  }
}

TaskRegistry.registerTaskHandler('log', Log)
