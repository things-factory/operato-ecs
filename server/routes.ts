import koaBodyParser from 'koa-bodyparser'
import { Order } from './entities/order'
import { getRepository } from 'typeorm'

process.on('bootstrap-module-route' as any, (app, routes) => {
  const bodyParserOption = {
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb'
  }

  routes.post('/create_order', koaBodyParser(), async (context, next) => {
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
})
