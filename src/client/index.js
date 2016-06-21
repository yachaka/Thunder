import { client as WebSocketClient } from 'websocket'
import logger from '../utils/logger'

/*
 * Testing purpose
 */

const log = logger('Client')
const client = new WebSocketClient()

client.on('connectFailed', error => {
  log(`Connect Error: ${error.toString()}`)
})

client.on('connect', connection => {
  log('WebSocket Client Connected')

  connection.on('error', error => {
    log(`Connection Error: ${error.toString()}`)
  })

  connection.on('close', () => {
    log('echo-protocol Connection Closed')
  })

  connection.on('message', message => {
    if (message.type === 'utf8') {
      log(`Received: ${message.utf8Data}`)
    }
  })

  const sendNumber = () => {
    if (connection.connected) {
      const number = Math.round(Math.random() * 0xFFFFFF)
      log(`Sending ${number.toString()}`)
      connection.sendUTF(number.toString())
      setTimeout(sendNumber, 1000)
    }
  }

  sendNumber()
})

client.connect('ws://0.0.0.0:3000?token=56', 'echo-protocol')

