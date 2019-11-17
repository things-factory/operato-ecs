export * from './entities'
export * from './graphql'
export * from './migrations'
export * from './engine'

import './routes'

import { ScenarioEngine } from './engine'

process.on('bootstrap-module-start' as any, async (app, config) => {
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - BEGIN %%%%%%%%%%%%%%%%')
  await ScenarioEngine.start()
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - END %%%%%%%%%%%%%%%%')
})
