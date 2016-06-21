
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

  /*
   * FIX:
   * Well this needs to be changed,
   * The whole HTTP route process needs to change.
   * We should use Express/Koa to handle these routes on another server
   * so we would get a server managing the websockets and a server managing
   * the routes
   */
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
 * socketHandlers: A function that takes the WebSocket conenction and processes it
 */
export default ({
  routes = {},
  authenticate = () => Promise.resolve(),
  socketHandler,
}) => (name, port) => {

  const router = createRouter(routes)

  const httpServer = http.createServer(router)
    .listen(port, () => {
      log(`Server listening on port ${port}`)
    })

  new WServer({ httpServer, autoAcceptConnections: false })
    .on('error', e => log.error(e.message))
    .on('request', req => {

      return authenticate(req)
        .then(client =>
          socketHandler(client, req))
        /*
         * Authorization failed,
         * for now, we can just log it
         */
        .catch(e => {
          log.warn('Request was rejected')
          req.reject()

          if (e) {
            log.error(e.message)
          }
        })
    })
}
