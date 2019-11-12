import { pubsub } from '@things-factory/shell'

export const scenarioState = {
  scenarioState: {
    /* subscription payload can be filtered here */
    // resolve(payload, args) {
    //   return payload.systemRebooted
    // },
    subscribe(_, args, { ctx }) {
      /* it is possible to check authentication here */
      // if (!ctx.user) {
      //   return null
      // }
      return pubsub.asyncIterator('scenario-state')
    }
  }
}
