export * from './entities'
export * from './graphql'
export * from './migrations'
export * from './engine'

import './routes'
import TaskEngine from './engine/task-engine'

process.on('bootstrap-module-start' as any, (app, config) => {
  TaskEngine.start()
})
