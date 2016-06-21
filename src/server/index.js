
import routes from './routes'
import createServer from './server'
import authenticate from './authenticate'
import socketHandler from './socket'

/*
 * This code is so cute
 */
const server = createServer({
  routes,
  authenticate,
  socketHandler,
})

server(3000)
