import { client as WebSocketClient } from 'websocket'
import logger from '../utils/logger'

const log = logger('Client')

/*
 * Cute, right?
 */
export const connect = (address) => new Promise((resolve, reject) => {

  const client = new WebSocketClient()

  client.on('connectFailed', reject)
  client.on('error', reject)
  client.on('connect', resolve)
  client.connect(address, 'echo-protocol')
})

/*
 * Subscriber
 */
connect('ws://0.0.0.0:3000?listen=facebook')
  .then(connection => {
    connection.on('message', message => message.type === 'utf8'
      && log(`Subscriber received message ${message.utf8Data}`))
  })
  .catch(e => log.error(e.message))

/*
 * Source
 */
connect('ws://0.0.0.0:3000?token=56')
  .then(connection => {
    setInterval(() => {
      connection.sendUTF(JSON.stringify({
        name: 'facebook',
        data: 'Hello',
      }))
    }, 1000)
  })
  .catch(e => log.error(e.message))
