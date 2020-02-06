import koaBodyParser from 'koa-bodyparser'
import { getConnection, getRepository } from 'typeorm'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  fallbackOption.whiteList.push(`^\/(${['create_order', 'get_orders', 'update_orders'].join('|')})($|[/?#])`)
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

  // routes.post('/create_order', koaBodyParser(bodyParserOption), async (context, next) => {
  //   try {
  //     const order = await getRepository(Order).query(
  //       `select * from orders where sku_cd = '${context.request.body.skuCd}'`
  //     )
  //     if (order.length <= 0) {
  //       await getRepository(Order).save(context.request.body)
  //     } else {
  //       await getRepository(Order).query(
  //         `update orders set qty='${order[0].qty + 1}'where sku_cd = '${context.request.body.skuCd}'`
  //       )
  //     }
  //     context.type = 'application/json'
  //     context.body = order
  //   } catch (e) {
  //     context.status = 401
  //     context.body = {
  //       text: context,
  //       message: e.message
  //     }
  //   }
  // })

  // routes.get('/get_orders', async (context, next) => {
  //   try {
  //     const getOrders = await getRepository(Order).find()
  //     context.type = 'application/json'
  //     context.body = getOrders
  //   } catch (e) {
  //     context.status = 401
  //     context.body = {
  //       text: context,
  //       message: e.message
  //     }
  //   }
  // })

  // routes.post('/update_orders', async (context, next) => {
  //   try {
  //     const orders = JSON.parse(context.request.body.orders)
  //     let ids = []
  //     orders.map(function(order) {
  //       ids.push(order.id)
  //     })
  //     //새로운 주문번호 업데이트
  //     let newOrderId = await getRepository(Order).query(`select max(order_id) max from orders`)[0]
  //     if (!newOrderId) newOrderId = 0
  //     // await getRepository(Order).query(`update orders set order_id = '${newOrderId + 1}',status='W'`)
  //     await getConnection()
  //       .createQueryBuilder()
  //       .update(Order)
  //       .set({ orderId: newOrderId + 1 })
  //       .where('id = :id', { id: ids })
  //       .execute()
  //   } catch (e) {
  //     context.status = 401
  //     context.body = {
  //       text: context,
  //       message: e.message
  //     }
  //   }
  // })
})
