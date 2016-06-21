
import routes from './routes'
import createSocketServer from './server'
import authenticate from './authenticate'
import socketHandler from './socket'
import Subscriber from './Subscriber'

/*
 * Initialize the Sources Socket Server
 */
const sourceServer = createSocketServer({
  routes,
  authenticate,
  socketHandler,
})

/*
 * Initialize the Subscriber server
 */
const subscriberServer = createSocketServer({
  socketHandler: (client, connection) => new Subscriber(connection),
})

sourceServer('Source Server', 3000)
subscriberServer('Sub Server', 3001)
