export * from './entities'
export * from './graphql'
export * from './migrations'
export * from './engine'

import './routes'

import { TaskEngine } from './engine'

process.on('bootstrap-module-start' as any, async (app, config) => {
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - BEGIN %%%%%%%%%%%%%%%%')
  await TaskEngine.start()
  console.log('%%%%%%%%%%%%%%%% TASK ENGINE - END %%%%%%%%%%%%%%%%')
})
