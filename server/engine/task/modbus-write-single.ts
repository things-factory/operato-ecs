import { Connections, TaskRegistry } from '@things-factory/integration-base'

async function modbusWriteSingle(step, { logger }) {
  var {
    connection,
    params: { objectType = 'coil', address, value }
  } = step

  var client = Connections.getConnection(connection)
  if (!client) {
    throw new Error(`no connection : ${connection}`)
  }

  var response

  switch (objectType) {
    case 'holding register':
      await client.writeSingleRegister(address, parseInt(value))
      response = await client.readHoldingRegisters(address, 1)
      break
    default:
      await client.writeSingleCoil(address, !!value)
      response = await client.readCoils(address, 1)
  }

  var data = response && response.response._body.valuesAsArray[0]
  logger.info(data)

  return {
    data
  }
}

modbusWriteSingle.parameterSpec = [
  {
    type: 'select',
    name: 'objectType',
    label: 'object-type',
    property: {
      options: ['coil', 'holding register']
    }
  },
  {
    type: 'number',
    name: 'address',
    label: 'address'
  },
  {
    type: 'number',
    name: 'value',
    label: 'value'
  }
]

TaskRegistry.registerTaskHandler('modbus-write-single', modbusWriteSingle)
