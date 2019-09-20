import koaBodyParser from 'koa-bodyparser'
import { Order } from './entities/order'
import { getConnection, getRepository } from 'typeorm'
import { ordersResolver } from './graphql/resolvers/order/orders'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  fallbackOption.whiteList.push('/create_order', '/get_orders', '/update_orders')
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
      const order = await getRepository(Order).query(
        `select * from orders where sku_cd = '${context.request.body.skuCd}'`
      )
      if (order.length <= 0) {
        await getRepository(Order).save(context.request.body)
      } else {
        await getConnection()
          .createQueryBuilder()
          .update(Order)
          .set({ qty: () => 'qty+1' })
          .where('sku_cd = :skuCd', { skuCd: context.request.body.skuCd })
          .execute()
      }
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
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })

  routes.post('/update_orders', async (context, next) => {
    try {
      const orders = JSON.parse(context.request.body.orders)
      let ids = orders.map(function(order) {
        return order.id
      })
      let maxOrderId = await getRepository(Order).query(`select max(order_id)+0 from orders`)
      await getConnection()
        .createQueryBuilder()
        .update(Order)
        .set({ orderId: maxOrderId + 1 })
        .where('id = :id', { id: ids })
        .execute()
    } catch (e) {
      context.status = 401
      context.body = {
        text: context,
        message: e.message
      }
    }
  })
})
