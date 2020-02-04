import net from 'net'
import PromiseSocket from 'promise-socket'
import uuid from 'uuid/v4'
import { getRepository, getManager, EntityManager } from 'typeorm'

import { Domain, client } from '@things-factory/shell'
import gql from 'graphql-tag'

import { config, logger } from '@things-factory/env'
import { User } from '@things-factory/auth-base'
import { Connections, Connector } from '@things-factory/integration-base'
import { Product, SaleOrder, SaleOrderDetail, WorkOrder } from '../../entities'
import { sleep } from '../utils'

export class OkPOS implements Connector {
  ready(connectionConfigs) {
    const CONFIG = config.get('tcpListener')

    return new Promise((resolve, reject) => {
      var server = net.createServer(socket => {
        socket.on('data', async data => {
          logger.warn('tcpListener: ')
          logger.warn(data.toString())
          var messageString = data.toString().replace(/(\r\n|\n|\r)/gm, '')
          var lastIdx = messageString.lastIndexOf('}')
          var firstIdx = messageString.indexOf('{')
          var dataString = messageString.substring(firstIdx, lastIdx + 1)

          try {
            var jsonData = JSON.parse(dataString)
          } catch (ex) {
            logger.error('tcpListener: jsonParse: ')
            logger.error(ex.stack)
            socket.write('error')
          }

          try {
            await this.processSaleOrder(jsonData)
            socket.write('success')
          } catch (ex) {
            console.log('processSaleOrder: error')
            logger.error('tcpListener: processSaleOrder: ')
            logger.error(ex.stack)
            socket.write('error')
          }
        })

        socket.on('end', () => {
          // FIXME
          console.log('client disconnected')
          logger.warn('tcpListener: client disconnected')
        })

        socket.on('error', ex => {
          // FIXME
          logger.error('tcpListener: error: ')
          console.log(ex.stack)
        })
      })

      server.listen(CONFIG.port, async () => {
        logger.info('tcp-listener server listening on %j', server.address())

        await Promise.all(connectionConfigs.map(this.connect))

        resolve()
      })
    })
  }

  async connect(connection) {
    let socket = new PromiseSocket(new net.Socket())
    let [host, port = 13766] = connection.endpoint.split(':')
    let { timeout = 30000 } = connection.params || {}

    socket.setTimeout(Number(timeout))
    await socket.connect(port, host)
    Connections.addConnection(connection.name, socket)
  }

  async disconnect(name) {
    let socket = Connections.removeConnection(name)
    await socket.destroy()
  }

  get parameterSpec() {
    return [
      {
        type: 'number',
        label: 'timeout',
        placeholder: 'milli-seconds',
        name: 'timeout'
      }
    ]
  }

  async processSaleOrder(data) {
    logger.info('processSaleOrder: start')
    await getManager().transaction(async (trxMgr: EntityManager) => {
      var _cache = config._CACHE

      var domains = _cache.get('DOMAIN')
      if (domains) {
        var domain = domains['SYSTEM']
      } else {
        let domainRepo = trxMgr.getRepository(Domain)
        var domain = await domainRepo.findOne({ name: 'SYSTEM' })
      }

      var details = data.PRODUCT
      // var date = new Date()
      // var month: any = date.getMonth() + 1
      // month = month < 10 ? `0${month}` : month
      var name = `SO${data.SALE_DATE}${data.BILL_NO}`
      var saleOrderRepo = getRepository(SaleOrder)
      // 해당 name으로 so가 존재하면 처리 안함.
      let so = await saleOrderRepo.findOne({
        where: { domain: domain, name:  name },
        relations: ['domain', 'details', 'details.product', 'creator', 'updater']
      })
      if (so) {
        logger.info(`so: ${name} is exist!`)
        return
      }

      var users = _cache.get('USER')
      if (users) {
        var user = users['admin@hatiolab.com']
      } else {
        let userRepo = trxMgr.getRepository(User)
        var user = await userRepo.findOne({ email: 'admin@hatiolab.com' })
      }

      var qty = 0
      var newSo = new SaleOrder()
      newSo.id = uuid()
      newSo.name = name
      newSo.domain = domain
      // newSo.description = `POS_NO: ${}`
      newSo.posNo = data.POS_NO
      if (data.ORG_BILL_NO && data.ORG_BILL_NO != '') {
        newSo.status = 'CANCELED'
        newSo.type = 'C'
      } else {
        newSo.status = 'INIT'
      }
      newSo.qty = 0
      newSo.creator = user
      newSo.updater = user
      await saleOrderRepo.save(newSo)

      let saleOrderDetailRepo = getRepository(SaleOrderDetail)
      details.forEach(async detail => {
        qty += parseFloat(detail.SALE_QTY)

        let sod = new SaleOrderDetail()
        sod.domain = domain
        // let product = new Product()
        // product.id = 'PRD001' // FIXME: name-id relation from buffer
        var products = _cache.get('PRODUCT')
        var product = null
        if (products) {
          product = products[detail['PROD_CD']]
        } else {
          var productRepo = trxMgr.getRepository(Product)
          product = await productRepo.findOne({ code: detail['PROD_CD'] })
          if (!product) {
            throw 'product code not found'
          }
        }

        sod.name = `${newSo.name}${product.code}`
        sod.saleOrder = newSo
        sod.product = product
        sod.qty = parseFloat(detail.SALE_QTY)
        if (newSo.status == 'CANCELED') {
          sod.status = 'CANCELED'
        } else {
          sod.status = 'INIT'
        }
        sod.creator = user
        sod.updater = user
        await saleOrderDetailRepo.save(sod)
      })

      // so.qty = qty // FIXME
      // saleOrderRepo.save(so)
      await trxMgr
        .createQueryBuilder()
        .update(SaleOrder)
        .set({ qty: qty })
        .where('id = :id', { id: newSo.id })
        .execute()

      // 취소오더 처리.
      // 중복오더 위에서 return됨, ORG_BILL_NO값이 있으면 취소 오더로 간주됨.
      var orgBillNo = data.ORG_BILL_NO
      if (orgBillNo && orgBillNo != '') {
        let name = `SO${data.SALE_DATE}${data.ORG_BILL_NO}`
        let so = await saleOrderRepo.findOne({
          where: { domain: domain, name: name },
          relations: ['domain', 'details', 'details.product', 'creator', 'updater']
        })
        
        try {
          this.processCancel(trxMgr, so)
        } catch(ex) {
          logger.error('processCancel: ')
          logger.error(ex.stack)
        }

        // await client.query({  // transaction? // TODO
        //   query: gql`
        //     mutation {
        //       updateSaleOrderStatus(
        //         id: "${so.id}"
        //         patch: {
        //           status: "CANCELED"
        //         }
        //       ) {
        //         code
        //         name
        //         description
        //         type
        //         active
        //       }
        //     }
        //   `
        // })
      }
    })
  }

  async processCancel(trxMgr: EntityManager, so: SaleOrder) {
    let soRepo = trxMgr.getRepository(SaleOrder)
    so.status = 'CANCELED'
    await soRepo.save(so)
    
    // update sod status
    let sodRepo = trxMgr.getRepository(SaleOrderDetail)
    let [sods, sodTotal] = await sodRepo.findAndCount({
      // where: { domain: context.state.domain, id },
      where: { saleOrder: so },
    })
    sods.forEach(async (sod) => {
      sod.status = so.status
      await sodRepo.save(sod)
    })

    // update wo status
    let woRepo = trxMgr.getRepository(WorkOrder)
    let [wos, woTotal] = await woRepo.findAndCount({
      // where: { domain: context.state.domain, id },
      where: { saleOrder: so },
      // relations: ['domain', 'details', 'details.product', 'creator', 'updater']
    })

    if (!wos || wos.length == 0) {
      return
    }

    wos.forEach(async (wo) => {
      wo.status = so.status
      await woRepo.save(wo)
    })
  }
}

Connections.registerConnector('okpos', new OkPOS())
