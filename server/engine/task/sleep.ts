import { sleep } from '../utils'
import { TaskRegistry } from '../task-registry'

async function Sleep(step) {
  var { delay } = step

  console.log(`sleep ${delay}ms`)

  if (delay) {
    await sleep(delay)
  }
}

TaskRegistry.registerTaskHandler('sleep', Sleep)
