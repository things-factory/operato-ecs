import { TaskRegistry } from './task-registry'
import { Step } from './types'

async function process(step) {
  var { type } = step

  var handler = TaskRegistry.getTaskHandler(type)
  if (!handler) {
    console.error('no task handler for type-', type)
  } else {
    await handler(step)
  }
}

enum STATE {
  READY,
  STARTED,
  PAUSED,
  STOPPED
}

export class Scenario {
  private steps: Step[]
  private state: STATE = STATE.READY
  private lastStep: number = -1

  constructor(steps: Step[]) {
    this.steps = steps || []
  }

  async run() {
    if (this.state == STATE.STARTED) {
      return
    }

    this.state = STATE.STARTED

    while (this.state == STATE.STARTED) {
      this.lastStep = (this.lastStep + 1) % this.steps.length

      await process(this.steps[this.lastStep])
    }
  }

  start() {
    this.run()
  }

  resume() {
    this.run()
  }

  stop() {
    this.state = STATE.STOPPED
  }

  despose() {
    this.stop()
  }
}
