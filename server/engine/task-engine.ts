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
    params: {
      duration: 1000
    }
  },
  {
    type: 'log',
    params: {
      message: 'Scenario START'
    }
  },
  {
    type: 'sleep',
    params: {
      duration: 1000
    }
  },
  {
    type: 'echo-send',
    connection: 'echo-back@localhost',
    params: {
      message: 'echo-1'
    }
  },
  {
    type: 'sleep',
    params: {
      duration: 1000
    }
  },
  {
    type: 'echo-receive',
    connection: 'echo-back@localhost'
  },
  {
    type: 'sleep',
    params: {
      duration: 1000
    }
  },
  {
    type: 'echo-send',
    connection: 'echo-back@localhost',
    params: {
      message: 'echo-2'
    }
  },
  {
    type: 'sleep',
    params: {
      duration: 1000
    }
  },
  {
    type: 'echo-receive',
    connection: 'echo-back@localhost'
  },
  {
    type: 'sleep',
    params: {
      duration: 1000
    }
  },
  {
    type: 'log',
    params: {
      message: 'Scenario END',
      level: 'warn'
    }
  },
  {
    type: 'sleep',
    params: {
      duration: 1000
    }
  },
  {
    type: 'publish',
    params: {
      message: 'Scenario END'
    }
  },
  {
    type: 'sleep',
    params: {
      duration: 1000
    }
  }
]

var scenario2: Step[] = [
  {
    connection: 'indi@192.168.1.207',
    type: 'robot_move',
    params: {
      position: 'test1'
    }
  },
  {
    connection: 'plc@192.168.1.208',
    type: 'onoff',
    params: {
      plcAddress: 'M0',
      value: 1
    }
  },
  {
    connection: 'plc@192.168.1.208',
    type: 'watching',
    params: {
      plcAddress: 'Y3',
      value: 1
    }
  },
  {
    connection: 'plc@192.168.1.208',
    type: 'onoff',
    params: {
      plcAddress: 'M0',
      value: 0
    }
  },
  {
    connection: 'indi@192.168.1.207',
    type: 'robot_move',
    params: {
      position: 'test2'
    }
  },
  {
    connection: 'indi@192.168.1.207',
    type: 'robot_move',
    params: {
      position: 'test3'
    }
  },
  {
    connection: 'indi@192.168.1.207',
    type: 'robot_move',
    params: {
      position: 'test4'
    }
  },
  {
    connection: 'indi@192.168.1.207',
    type: 'robot_move',
    params: {
      position: 'test5'
    }
  }
]

function loadScenarios() {
  var sc1 = new Scenario('sample-scenario', scenario1)
  // var sc2 = new Scenario('robot-scenario', scenario2)

  sc1.start()
  // sc2.start()
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
