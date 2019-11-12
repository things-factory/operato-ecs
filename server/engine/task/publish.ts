import { TaskRegistry } from '../task-registry'

async function Publish(step, { logger, publish }) {
  var { message } = step

  publish(message)
}

TaskRegistry.registerTaskHandler('publish', Publish)
