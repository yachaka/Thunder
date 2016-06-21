
import logger from '../utils/logger'

const log = logger('Socket')

export default (client, connection) => {

  log.validate(`Connection accpeted from ${client.name}`)

  connection.on('message', message => {

    /*
     * FIX: Parse message as JSON straight
     * away to get the token/content-type etc ?
     */

    switch (message.type) {

    case 'utf8':
      log(`Message from ${connection.remoteAddress}: ${message.utf8Data}`)
      return connection.sendUTF(message.utf8Data)

    case 'binary':
      log(`Binary from ${connection.remoteAddress}: ${message.binaryData.length}`)
      return connection.sendBytes(message.binaryData)

    default:
      log.warn(`Unknown message type (${message.type}) from ${connection.remoteAddress}`)
    }
  })

  connection.on('error', e => log.error(e))

  connection.on('close', () => {
    log.warn(`Connection from ${connection.remoteAddress} closed`)
  })
}
