
import { server as WServer } from 'websocket'
import http from 'http'
import logger from '../utils/logger'
import router from './router'

const log = logger('UDP Server')

const createServer = ({ router, isAuthorized }) => port => {

  const httpServer = http.createServer(router)

  httpServer.listen(port, () => {
    log(`Server listening on port ${port}`)
  })

  const wserver = new WServer({ httpServer, autoAcceptConnections: false })

  wserver.on('error', e => log.error(e.message))

  wserver.on('request', req => {
    if (!isAuthorized(req)) {
      req.reject()
      log.warn('Request was rejected')
    }

    const connection = req.accept('echo-protocol', req.origin)

    log.validate(`Connection accpeted from ${connection.remoteAddress}`)

    connection.on('message', message => {
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
  })
}

createServer({
  router,
  isAuthorized: () => true,
  socketHandlers: v => v,
})(3000)