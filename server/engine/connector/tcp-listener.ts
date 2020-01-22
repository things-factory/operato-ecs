import net from 'net'
import PromiseSocket from 'promise-socket'
import uuid from 'uuid/v4'
import { getRepository } from 'typeorm'

import { config, logger } from '@things-factory/env'
import { Domain } from '@things-factory/shell'
import { Connections, Connector } from '@things-factory/integration-base'
import { SaleOrder, Product, SaleOrderDetail } from '../../entities'

export class TcpListnerConnector implements Connector {
  ready(connectionConfigs) {
    const CONFIG = config.get('tcpListener')

    return new Promise((resolve, reject) => {
      var server = net.createServer(socket => {
        socket.on('data', data => {
          logger.warn('tcpListener: ')
          logger.warn(data.toString())
          var messageString = data.toString().replace(/(\r\n|\n|\r)/gm,"")
					// var lastIdx = messageString.lastIndexOf("}")
					// var firstIdx = messageString.indexOf("{")
					// var dataString = messageString.substring(firstIdx,(lastIdx-firstIdx)+100).slice(0,-1)
          
          try {
            var jsonData = JSON.parse(messageString)
          } catch(ex) {
            logger.error('tcpListener: jsonParse: ')
            logger.error(ex.stack)
          }

          try {
            this.processSaleOrder(jsonData)
          } catch(ex) {
            console.log('processSaleOrder: error')
            logger.error('tcpListener: processSaleOrder: ')
            logger.error(ex.stack)
            socket.write(data.toString())
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

    var details = data.PRODUCT;
    var date = new Date();
    var month: any = date.getMonth() + 1
    month = month < 10 ? `0${month}` : month
    var name = `SO${data.SALE_DATE}_${data.ORG_BILL_NO}${data.BILL_NO}`;
    var orders = [];
    // var domain = getRepository(Domain).findOne()
    var domain = new Domain()
    domain.id = 'ab1e2212-792c-4586-a2b1-014d5de0b0e7'  // FIXME from buffer

    var qty = 0
    var so = new SaleOrder()
    so.id = uuid()
    so.name = name
    so.domain = domain
    so.description = `POS_NO: ${data.POS_NO}`
    so.status  = 'INIT'
    so.qty = 0
    await getRepository(SaleOrder).save(so)
    
    details.forEach((detail, idx) => {
      qty += detail.SALE_QTY
      
      let sod = new SaleOrderDetail()
      sod.id = uuid()
      sod.domain = domain
      let product = new Product()
      // product.id = 'PRD001' // FIXME from buffer
      product.id = '744c301b-fcd9-4871-a211-e0a229386549'
      product.code = detail.PROD_CD
      sod.product = product
      sod.qty = detail.SALE_QTY
      sod.saleOrder = so
      await getRepository(SaleOrderDetail).save(sod)
    })

    // so.qty = qty // FIXME
    // getRepository(SaleOrder).save(so)
  }
}

Connections.registerConnector('tcp-listener', new TcpListnerConnector())
