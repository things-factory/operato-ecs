import { Connections, TaskRegistry } from '@things-factory/integration-base'
import uuid from 'uuid/v4'

// mosquitto_sub -h 192.168.2.7 -p 1883 -u dd05:admin -P admin -t dps_server
async function IndicatorPublish(step, context) {
  var { logger, data } = context
  var {
    connection: connectionName,
    params: { topic, message }
  } = step

  const { client } = Connections.getConnection(connectionName)
  if (!client) {
    throw Error(`connection is not found : ${connectionName}`)
  }

  if (!topic || !message) {
    throw Error(`topic and message should be defined: : topic - '${topic}', message - '${message}'`)
  }

  message = JSON.parse(new Function(`return \`${message}\`;`).apply(context))
  Object.assign(message.properties, {
    id: uuid(),
    time: new Date().getTime()
  })

  message = JSON.stringify(message)

  await client.publish(topic, message)

  logger.info(`indicator-publish :\ntopic '${topic}',\nmessage '${message}'`)

  return {
    data: message
  }
}

IndicatorPublish.parameterSpec = [
  {
    type: 'string',
    name: 'topic',
    label: 'topic'
  },
  {
    type: 'textarea',
    name: 'message',
    label: 'message'
  }
]

TaskRegistry.registerTaskHandler('indicator-publish', IndicatorPublish)



// {
// 	 properties: {
//   	 id: 'uuid',
//     time: 'new Date()',
//     dest_id: 'dd05/1132D2',
//     source_id: 'mps_server',
//     is_reply: 'TRUE',
//     no_ack: 'FALSE'
//   },
//   body: {
// 		action: 'GW_INIT_REQ_ACK'
//   }
// }