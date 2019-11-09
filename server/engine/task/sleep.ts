import { logger } from '@things-factory/env'
import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'

async function Sleep(step, { logger }) {
  var { delay } = step

  logger.info(`sleep ${delay}ms`)

  if (delay) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('sleep', Sleep)
