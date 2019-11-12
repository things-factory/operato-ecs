/*
 * task-engine
 * - connectors configuration을 읽어서 각 connection 들을 연결한다.
 * - connections connect가 완료되면, 등록된 모든 scenario 들을 읽어서 각각의 scenario 객체에 넣는다.
 * - 각각의 scenario에서 발생하는 이벤트들을 핸들링할 수 있도록 subscriber 핸들러를 연결한다. (started, progress, finished)
 * - scenario stop, resume, add, remove 등을 처리할 수 있는 핸들러를 연결한다.
 * - started 상태의 scenario를 작동시킨다.
 */

import { logger } from '@things-factory/env'

import { Step } from './types'
import { Scenario } from './scenario'
import { Connections } from './connections'

var scenario1: Step[] = [
  {
    type: 'sleep',
    delay: 1000
  },
  {
    type: 'log',
    message: 'Scenario START'
  },
  {
    type: 'sleep',
    delay: 1000
  },
  {
    type: 'echo-send',
    connection: 'echo@localhost',
    message: 'echo-1'
  },
  {
    type: 'sleep',
    delay: 1000
  },
  {
    type: 'echo-receive',
    connection: 'echo@localhost'
  },
  {
    type: 'sleep',
    delay: 1000
  },
  {
    type: 'echo-send',
    connection: 'echo@localhost',
    message: 'echo-2'
  },
  {
    type: 'sleep',
    delay: 1000
  },
  {
    type: 'echo-receive',
    connection: 'echo@localhost'
  },
  {
    type: 'sleep',
    delay: 1000
  },
  {
    type: 'log',
    message: 'Scenario END'
  },
  {
    type: 'sleep',
    delay: 1000
  },
  {
    type: 'publish',
    message: 'Scenario END'
  },
  {
    type: 'sleep',
    delay: 1000
  }
]

var scenario2: Step[] = [
  {
    ip: 'indi@192.168.1.207',
    type: 'robot_move',
    name: 'test1'
  },
  {
    ip: 'indi@192.168.1.207',
    type: 'robot_move',
    name: 'test2'
  },
  {
    ip: 'indi@192.168.1.207',
    type: 'robot_move',
    name: 'test3'
  },
  {
    ip: 'indi@192.168.1.207',
    type: 'robot_move',
    name: 'test4'
  },
  {
    ip: 'indi@192.168.1.207',
    type: 'robot_move',
    name: 'test5'
  }
]

function loadScenarios() {
  var sc1 = new Scenario('sample-scenario', scenario1)
  var sc2 = new Scenario('robot-scenario', scenario2)

  sc1.start()
  sc2.start()
}

export class TaskEngine {
  static async start() {
    try {
      await Connections.ready()

      logger.info('connections done: %s', JSON.stringify(Object.keys(Connections.getConnections())))
      loadScenarios()
    } catch (ex) {
      logger.error(ex)
    }
  }

  static stop() {}

  static on() {}
}
