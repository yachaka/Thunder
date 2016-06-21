
import logger from '../utils/logger'
import emit from './emit'

const log = logger('Socket')

/*
 * Socket Handler
 *
 * called for each socket to handle its connection.
 *
 * TODO:
 * define the payload format to filter it when it arrives and before sending it
 */
export default (client, connection) => {

  log.validate(`Connection accpeted from ${client.name}`)

  connection.on('message', message => {

    if (message.type !== 'utf8') {
      log.warn(`Unknown message type (${message.type}) from ${connection.remoteAddress}`)
      return connection.sendUTF('ko')
    }

    log(`Message from ${connection.remoteAddress}: ${message.utf8Data}`)

    /*
     * :'(
     */
    let payload
    try {
      payload = JSON.parse(message.utf8Data)
    } catch (e) {
      log.error(e.message)
      return connection.sendUTF('ko')
    }

    /*
     * Payload must contain the integration name
     * Or... we can just emit the client as well as the payload
     */
    return emit(payload)
  })

  connection.on('error', e => log.error(e.message))

  connection.on('close', () => {
    log.warn(`Connection from ${connection.remoteAddress} closed`)
  })
}
