import net from 'net'
import PromiseSocket from 'promise-socket'
import uuid from 'uuid/v4'
import { getRepository, getManager, EntityManager } from 'typeorm'

import { config, logger } from '@things-factory/env'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { Connections, Connector } from '@things-factory/integration-base'
import { SaleOrder, Product, SaleOrderDetail } from '../../entities'
import { sleep } from '../utils'

export class TcpListnerConnector implements Connector {
  ready(connectionConfigs) {
    const CONFIG = config.get('tcpListener')

    return new Promise((resolve, reject) => {
      var server = net.createServer(socket => {
        socket.on('data', async data => {
          logger.warn('tcpListener: ')
          logger.warn(data.toString())
          var messageString = data.toString().replace(/(\r\n|\n|\r)/gm,"")
					var lastIdx = messageString.lastIndexOf("}")
					var firstIdx = messageString.indexOf("{")
					var dataString = messageString.substring(firstIdx, lastIdx+1)
          
          try {
            var jsonData = JSON.parse(dataString)
          } catch(ex) {
            logger.error('tcpListener: jsonParse: ')
            logger.error(ex.stack)
            socket.write("error")
          }

          try {
            await this.processSaleOrder(jsonData)
            socket.write("success")
          } catch(ex) {
            console.log('processSaleOrder: error')
            logger.error('tcpListener: processSaleOrder: ')
            logger.error(ex.stack)
            socket.write("error")
          }
        })

        socket.on('end', () => {
          // FIXME
          console.log('client disconnected');
          logger.warn('tcpListener: client disconnected')
        });

        socket.on('error', ex => {
          // FIXME
          logger.error('tcpListener: error: ')
          console.log(ex.stack)
        });
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

    socket.setTimeout(timeout)
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
      // TODO cancel

      var details = data.PRODUCT;
      var date = new Date();
      var month: any = date.getMonth() + 1
      month = month < 10 ? `0${month}` : month
      var name = `SO${data.SALE_DATE}${data.ORG_BILL_NO}${data.BILL_NO}`;
      
      var _cache = config._CACHE

      var domains = _cache.get('DOMAIN')
      if (domains) {
        var domain = domains['SYSTEM']
      } else {
        var domainRepo = trxMgr.getRepository(Domain)
        var domain = await domainRepo.findOne({ name: 'SYSTEM' })
      }
      // var domain = new Domain()
      // domain.id = 'ab1e2212-792c-4586-a2b1-014d5de0b0e7'  // FIXME: from buffer

      var users = _cache.get('USER')
      if (users) {
        var user = users['admin@hatiolab.com']
      } else {
        var userRepo = trxMgr.getRepository(User)
        var user = await userRepo.findOne({ email: 'admin@hatiolab.com' })
      }

      var qty = 0
      var so = new SaleOrder()
      so.id = uuid()
      so.name = name
      so.domain = domain
      // so.description = `POS_NO: ${}`
      so.posNo = data.POS_NO
      so.status  = 'INIT'
      so.qty = 0
      so.creator = user
      so.updater = user
      var saleOrderRepo = getRepository(SaleOrder)
      await saleOrderRepo.save(so)
      
      let saleOrderDetailRepo = getRepository(SaleOrderDetail)
      details.forEach(async detail => {
        qty += parseFloat(detail.SALE_QTY)
        
        let sod = new SaleOrderDetail()
        sod.id = uuid()
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

        sod.saleOrder = so
        sod.product = product
        sod.qty = parseFloat(detail.SALE_QTY)
        sod.status = 'INIT'
        sod.creator = user
        sod.updater = user
        await saleOrderDetailRepo.save(sod)
      })

      // so.qty = qty // FIXME
      // saleOrderRepo.save(so)
      await trxMgr.createQueryBuilder()
        .update(SaleOrder)
        .set({ qty: qty })
        .where("id = :id", { id: so.id })
        .execute();
    })
  }
}

Connections.registerConnector('tcp-listener', new TcpListnerConnector())