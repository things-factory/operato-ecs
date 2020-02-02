import { logger } from '@things-factory/env'
import { Connections, Connector } from '@things-factory/integration-base'
import { USB } from 'escpos'

export class USBDevice implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    logger.info('usb-devices are ready')
  }

  async connect(connection) {
    const {
      vendorId = 0x0483 /* STMicroelectronics */,
      productId = 0x5743 /* XPrinter Product ? */
    } = connection.params

    /* 
      TODO escpos 모듈의 device adapter 호환 connection을 사용하고 있으나, connection 명세를 별도로 정의해서 제공하도록 해야한다.
    */
    const device = new USB(Number(vendorId), Number(productId))

    Connections.addConnection(connection.name, device)
  }

  async disconnect(name) {
    let device = Connections.removeConnection(name)

    await device.close()
  }

  get parameterSpec() {
    return [
      {
        type: 'string',
        label: 'vendor-id',
        placeholder: '0x0483',
        name: 'vendorId'
      },
      {
        type: 'string',
        label: 'product-id',
        placeholder: '0x5743',
        name: 'productId'
      }
    ]
  }
}

Connections.registerConnector('usb-device', new USBDevice())
