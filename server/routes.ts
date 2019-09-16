import koaBodyParser from 'koa-bodyparser'
import { Order } from './entities/order'
import { getRepository } from 'typeorm'

process.on('bootstrap-module-route' as any, (app, routes) => {
  const bodyParserOption = {
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb',
    extendTypes: {
      text: ['application/xml']
    }
  }

  routes.post('/create_order', koaBodyParser(bodyParserOption), async (context, next) => {
    try {
      const order = context.request.body
      const newOrder = await getRepository(Order).save(order)
      return newOrder
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })

  routes.get('/get_order/:model', async (context, next) => {
    try {
      const order = context.request.body
      const getOrder = await getRepository(Order).find(order)
      // context.type = 'text/plain'
      return getOrder
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })

  routes.post('/reset_order', async (context, next) => {
    try {
      const order = context.request.body
      await getRepository(Order).remove(order)
      context.type = 'text/plain'
      return 'Complete'
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })
})
