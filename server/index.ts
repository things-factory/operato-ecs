import { Connections } from '@things-factory/integration-base'

export * from './entities'
export * from './graphql'
export * from './migrations'

import './routes'
import './engine'

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - BEGIN %%%%%%%%%%%%%%%%')
  try {
    await Connections.ready()
  } catch (ex) {
    Connections.logger.error(ex)
  }
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - END %%%%%%%%%%%%%%%%')
})
