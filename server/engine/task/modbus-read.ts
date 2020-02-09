import { Connections, TaskRegistry } from '@things-factory/integration-base'

async function modbusRead(step, { logger }) {
  var {
    connection,
    params: { objectType = 'coil', address, quantity = 1 }
  } = step

  var client = Connections.getConnection(connection)
  if (!client) {
    throw new Error(`no connection : ${connection}`)
  }

  var response

  switch (objectType) {
    case 'descrete input':
      response = await client.readCoils(address, quantity)
      break
    case 'input register':
      response = await client.readDiscreteInputs(address, quantity)
      break
    case 'holding register':
      response = await client.readHoldingRegisters(address, quantity)
      break
    default:
      response = await client.readCoils(address, quantity)
  }

  var data = response && response.response._body.valuesAsArray.slice(0, quantity)
  logger.info(`${JSON.stringify(data)}`)

  return {
    data
  }
}

modbusRead.parameterSpec = [
  {
    type: 'select',
    name: 'objectType',
    label: 'object-type',
    property: {
      options: ['coil', 'descrete input', 'input register', 'holding register']
    }
  },
  {
    type: 'number',
    name: 'address',
    label: 'address'
  },
  {
    type: 'number',
    name: 'quantity',
    label: 'quantity'
  }
]

TaskRegistry.registerTaskHandler('modbus-read', modbusRead)
