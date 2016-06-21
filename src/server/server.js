
import { server as WServer } from 'websocket'
import http from 'http'
import logger from '../utils/logger'

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
const createRouter = routes => (req, res) => {

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
export default ({ routes, authenticate, socketHandler }) => port => {

  const router = createRouter(routes)

  const httpServer = http.createServer(router)
    .listen(port, () => {
      log(`Server listening on port ${port}`)
    })

  new WServer({ httpServer, autoAcceptConnections: false })
    .on('error', e => log.error(e.message))
    .on('request', req => {

      return authenticate(req)
      /*
       * Goes to the socket Handler
       */
        .then(() =>
          socketHandler(req.accept('echo-protocol', req.origin)))
       /*
        * Authorization failed,
        * for now, we can just log it
        */
        .catch(() => {
          req.reject()
          log.warn('Request was rejected')
        })
    })
}
