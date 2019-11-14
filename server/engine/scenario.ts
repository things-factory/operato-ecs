import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'
import { pubsub } from '@things-factory/shell'

import { TaskRegistry } from './task-registry'
import { Step } from './types'

const { combine, timestamp, splat, printf } = format

enum STATE {
  READY,
  STARTED,
  PAUSED,
  STOPPED,
  HALTED
}

const status = ['READY', 'STARTED', 'PAUSED', 'STOPPED', 'HALTED']

export class Scenario {
  private name: string
  private steps: Step[]
  private rounds: number = 0
  private _state: STATE
  private message: String
  private lastStep: number = -1
  private logger: any

  private static logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  })

  constructor(name: string, steps: Step[]) {
    this.name = name
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

    this.state = STATE.READY
  }

  async run() {
    if (this.state == STATE.STARTED || this.steps.length == 0) {
      return
    }

    this.state = STATE.STARTED
    var context = {
      logger: this.logger,
      publish: this.publish.bind(this)
    }

    try {
      while (this.state == STATE.STARTED) {
        this.lastStep = (this.lastStep + 1) % this.steps.length

        if (this.lastStep == 0) {
          this.rounds++
          this.logger.info(`Start ${this.rounds} Rounds  #######`)
        }

        var step = this.steps[this.lastStep]
        await this.process(step, context)

        this.publish()
      }
    } catch (ex) {
      this.message = ex.stack ? ex.stack : ex
      this.state = STATE.HALTED
    }
  }

  publish(message?) {
    var steps = this.steps.length
    var step = this.lastStep + 1

    pubsub.publish('scenario-state', {
      scenarioState: {
        name: this.name,
        state: status[this.state],
        progress: {
          rounds: this.rounds,
          rate: Math.round(100 * (step / steps)),
          steps,
          step
        },
        message
      }
    })
  }

  get state() {
    return this._state
  }

  set state(state) {
    if (this._state == state) {
      return
    }

    var message = `[state changed] ${status[this.state]} => ${status[state]}${
      this.message ? ' caused by ' + this.message : ''
    }`

    this.message = ''

    this.logger.info(message)
    this._state = state

    this.publish(message)
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

  async process(step, context) {
    var { type } = step

    this.logger.info(`Step started. ${JSON.stringify(step)}`)

    var handler = TaskRegistry.getTaskHandler(type)
    if (!handler) {
      throw new Error(`no task handler for ${JSON.stringify(step)}`)
    } else {
      await handler(step, context)
    }

    this.logger.info(`Step done.`)
  }
}
