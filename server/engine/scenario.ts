import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import { logger } from '@things-factory/env'

import { TaskRegistry } from './task-registry'
import { Step } from './types'

const { combine, timestamp, splat, printf } = format

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
  private logger: any

  private static logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })

  constructor(name: string, steps: Step[]) {
    this.steps = steps || []
    this.logger = createLogger({
      format: combine(timestamp(), splat(), Scenario.logFormat),
      transports: [
        new (transports as any).DailyRotateFile({
          filename: `logs/scenario-${name}-%DATE%.log`,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info'
        })
      ]
    })
  }

  async run() {
    if (this.state == STATE.STARTED) {
      return
    }

    this.state = STATE.STARTED

    while (this.state == STATE.STARTED) {
      this.lastStep = (this.lastStep + 1) % this.steps.length

      await this.process(this.steps[this.lastStep])
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

  async process(step) {
    var { type } = step

    var handler = TaskRegistry.getTaskHandler(type)
    if (!handler) {
      logger.error('no task handler for type-', type)
    } else {
      await handler(step, {
        logger: this.logger
      })
    }
  }
}
