import koaBodyParser from 'koa-bodyparser'
import { Order } from './entities/order'
import { getRepository } from 'typeorm'
import { ordersResolver } from './graphql/resolvers/order/orders'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  fallbackOption.whiteList.push('/create_order', '/get_orders', '/delete_all_order')
})

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
      const order = JSON.parse(context.request.body.orders)
      context.body = await getRepository(Order).save(order)

      // const orders = JSON.parse(context.request.body.orders)
      // context.body = await getRepository(Order).save(orders)
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })

  routes.get('/get_orders', async (context, next) => {
    try {
      const getOrders = await getRepository(Order).find()
      context.type = 'application/json'
      context.body = getOrders
      // return context
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })

  routes.delete('/delete_all_order', async (context, next) => {
    try {
      const order = context.request.body
      context.type = 'text/plain'
      context.body = await getRepository(Order).clear()
      return context
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })
})
