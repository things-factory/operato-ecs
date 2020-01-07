import { Connections } from '@things-factory/integration-base'

export * from './entities'
export * from './graphql'
export * from './migrations'
export * from './engine'

import './routes'
import './engine'

import { logger } from '@things-factory/env'

process.on('bootstrap-module-start' as any, async (app, config) => {
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - BEGIN %%%%%%%%%%%%%%%%')
  try {
    await Connections.ready()

    logger.info('connections done: %s', JSON.stringify(Object.keys(Connections.getConnections())))
  } catch (ex) {
    logger.error(ex)
  }
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - END %%%%%%%%%%%%%%%%')
})
