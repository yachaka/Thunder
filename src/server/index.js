
import { server as WServer } from 'websocket'
import http from 'http'
import logger from '../utils/logger'
import routes from './router'

const log = logger('WebSocket Server')

/*
 * Very basic Router.
 *
 * When a POST /feed is performed by the client,
 * it is going to look for a field named `POST /feed`
 * in the routes Object
 *
 * if no route has been found, it sends back a 404 Http code
 */
const router = (req, res) => {

  log(`Received request for ${req.url}`)

  const key = `${req.method} ${req.url}`

  if (routes[key]) {
    res.writeHead(200)
    routes[key](req, res)
  } else {
    log.warn('Fallback, not Found')
    res.writeHead(404)
  }

  res.end()
}

/*
 * router: The http server routes
 *
 * isAuthorized: a function that tells if a webSocket connection
 *    is authorized
 *
 * TODO: socketHandlers: A function that takes the WebSocket conenction and processes it
 */
const createServer = ({ router, isAuthorized }) => port => {

  const httpServer = http.createServer(router)

  httpServer.listen(port, () => {
    log(`Server listening on port ${port}`)
  })

  const wserver = new WServer({ httpServer, autoAcceptConnections: false })

  wserver.on('error', e => log.error(e.message))

  wserver.on('request', req => {
    /*
     * FIX: socketHandlers goes here
     */

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
