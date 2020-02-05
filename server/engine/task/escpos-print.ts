/**
 * ESC/POS 호환 프린트 기능
 */

import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { Printer } from 'escpos'
import camelcase from 'lodash/camelCase'
import { promisify } from 'util'

const STRING_ARRAY = s => (s ? s.split(/\s*,\s*/) : [])
const NUMBER_ARRAY = s => (s ? s.split(/\s*,\s*/).map(Number) : [])
const OBJECT = s => {
  try {
    return JSON.parse(s)
  } catch (e) {
    console.error(e)
  }
}
const NONE = s => []

const COMMANDS = {
  font: STRING_ARRAY /* type - A | B */,
  align: STRING_ARRAY /* align - CT | LT | RT */,
  control: STRING_ARRAY,
  /*
    control : 
      LF for Line Feed
      FF for Form Feed
      CR for Carriage Return
      HT for Horizontal Tab
      VT for Vertical Tab
  */
  style: STRING_ARRAY,
  size: NUMBER_ARRAY /* width, height */,
  text: STRING_ARRAY /* text, encodeType */,
  barcode: STRING_ARRAY,
  /* 
    code,
    barcodeType - UPC-A | UPC-E | EAN13 | EAN8 | CODE39 | ITF | NW7,
    options -
      width : numeric value in the range between (1,255) Default: 64
      height: numeric value in the range between (2,6) Default: 3
      includeParity : boolean that defined if the parityBit shall be calculated to EAN13/EAN8 printers. default: true
      position : ABOVE | BELOW(default) | BOTH | OFF
  */
  table: STRING_ARRAY /* IMPLEMENT-ME Not implemented yet. */,
  tableCustom: OBJECT /* IMPLEMENT-ME Not implemented yet. */,
  qrimage: STRING_ARRAY,
  cut: STRING_ARRAY /* mode - mode set a full or partial cut. Default: full Partial cut is not implemented in all printers.*/,
  cashdraw: NUMBER_ARRAY /* numeric value which defines the pin to be used to send the pulse, it could be 2 or 5. */,
  beep: NUMBER_ARRAY,
  /*
    n - number of buzzer times
    t - buzzer sound length in (t * 100) milliseconds
   */
  drawLine: NONE,
  flush: NONE,
  close: NONE
}

const COMMANDS_PROMISIFY = ['qrimage']

function parseCommand(commandline: string) {
  var [commandName] = commandline.split(/ /, 1)
  var paramsString = commandline.substr(commandName.length + 1)
  var command = camelcase(commandName)
  var parameterSpec = COMMANDS[command]

  if (!parameterSpec) {
    throw new Error(`ESC Command '${commandName}' is not defined.`)
  }

  return {
    command,
    params: parameterSpec(paramsString)
  }
}

function parseCommands(command) {
  var commandlines = command
    .split('\n')
    .map(v => v.trim())
    .filter(v => !!v)

  return commandlines.map(parseCommand)
}

async function executeCommand(printer, commands, { logger, publish, data }) {
  var executes = parseCommands(commands)
  var needSleep = true

  logger.info(JSON.stringify(executes, null, 2))

  for (let execute of executes) {
    let { command, params } = execute

    logger.info(`command(${command}) params(${JSON.stringify(params, null, 2)})`)

    if (command == 'qrimage') {
      needSleep = false
    }

    if (~COMMANDS_PROMISIFY.indexOf(command)) {
      await promisify(printer[command]).apply(printer, params)
    } else {
      printer[command].apply(printer, params)
    }
  }

  /* 
    FIXME - escpos 소스 분석과정에서 200ms 의 sleep 동작이 없으면, 프린터 출력에 문제가 있음을 발견함.
    Promisify로 해결될 문제가 아님.
  */
  needSleep &&
    (await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 200)
    }))

  await promisify(printer.flush).apply(printer)
}

async function ESCPOSPrint(step, context: { logger; publish; data }) {
  var {
    connection: connectionName,
    params: { encoding, command }
  } = step
  var connection = Connections.getConnection(connectionName)

  if (!connection) {
    throw new Error(`connection '${connectionName}' is not established.`)
  }

  /* TODO string interpolation 기능 제공시 security hole 문제를 해결할 수 있도록 DSL 방식으로 제공할 것 */
  const interpolatedCommand = new Function(`return \`${command}\`;`).apply(context)

  /* 
    TODO escpos 모듈의 device adapter 호환 connection을 전제로 하고 있으나, connection 명세를 별도로 정의해서 제공하도록 해야한다.
  */
  /* promisified Printer */
  const printer = new Printer(connection, { encoding } /* options */)

  connection.open()
  await executeCommand(printer, interpolatedCommand, context)
  connection.close()

  return {
    data: true
  }
}

ESCPOSPrint.parameterSpec = [
  {
    type: 'select',
    label: 'encoding',
    name: 'encoding',
    property: {
      options: ['', 'EUC-KR', 'GB18030']
    }
  },
  {
    type: 'textarea',
    name: 'command',
    label: 'command'
    /* [sample command]
      FONT A
      ALIGN CT
      SIZE 1, 1
      TEXT It aint over till it's over
      TEXT 敏捷的棕色狐狸跳过懒狗, GB18030
      TEXT 안녕하세요 ${this.data.abc}, EUC-KR
      BARCODE 1234567, EAN8
      QRIMAGE https://github.com/song940/node-escpos
      TEXT 마무리합니다. 이상 끝.
      CUT
    */
  }
]

TaskRegistry.registerTaskHandler('escpos-print', ESCPOSPrint)
