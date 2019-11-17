/*
 * task-engine
 * - connectors configuration을 읽어서 각 connection 들을 연결한다.
 * - connections connect가 완료되면, 등록된 모든 scenario 들을 읽어서 각각의 scenario 객체에 넣는다.
 * - 각각의 scenario에서 발생하는 이벤트들을 핸들링할 수 있도록 subscriber 핸들러를 연결한다. (started, progress, finished)
 * - scenario stop, resume, add, remove 등을 처리할 수 있는 핸들러를 연결한다.
 * - started 상태의 scenario를 작동시킨다.
 */

import { logger } from '@things-factory/env'

import { Scenario } from './scenario'
import { Connections } from './connections'

export class TaskEngine {
  static async start() {
    try {
      await Connections.ready()

      logger.info('connections done: %s', JSON.stringify(Object.keys(Connections.getConnections())))

      Scenario.loadAll()
    } catch (ex) {
      logger.error(ex)
    }
  }

  static stop() {}

  static on() {}
}
