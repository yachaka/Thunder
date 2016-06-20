
import logger from '../utils/logger'

const log = logger('Router')

const routes = {
  '/feed': () => log.validate('Route found'),
}

export default (req, res) => {

  log(`Received request for ${req.url}`)

  if (routes[req.url]) {
    res.writeHead(200)
    routes[req.url](req, res)
  } else {
    res.writeHead(404)
  }

  res.end()
}
