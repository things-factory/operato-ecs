/*
 * task-engine
 * - connectors configuration을 읽어서 각 connection 들을 연결한다.
 * - connections connect가 완료되면, 등록된 모든 scenario 들을 읽어서 각각의 queue에 넣는다.
 * - 각각의 queue에서 발생하는 이벤트들을 핸들링할 수 있도록 subscriber 핸들러를 연결한다. (started, progress, finished)
 * - scenario stop, resume, add, remove 등을 처리할 수 있는 핸들러를 연결한다.
 * - started 상태의 queue를 작동시킨다.
 */

import { Step } from './types'
import { Scenario } from './scenario'
import { Connections } from './connections'

var steps: Step[] = [
  {
    sequence: '1',
    type: 'echo-send',
    connection: 'echo@localhost',
    message: 'echo-1'
  },
  {
    sequence: '2',
    type: 'echo-receive',
    connection: 'echo@localhost'
  },
  {
    sequence: '3',
    type: 'sleep',
    delay: 3000
  },
  {
    sequence: '4',
    type: 'echo-send',
    connection: 'echo@localhost',
    message: 'echo-2'
  },
  {
    sequence: '5',
    type: 'echo-receive',
    connection: 'echo@localhost'
  }
]

function loadScenarios() {
  var scenario = new Scenario(steps)
  scenario.start()
}

export class TaskEngine {
  static async start() {
    try {
      await Connections.ready()

      console.log('connections done:', Connections.getConnections())
      loadScenarios()
    } catch (ex) {
      console.error(ex)
    }
  }

  static stop() {}

  static on() {}
}
