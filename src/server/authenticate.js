
import logger from '../utils/logger'
import { authError } from '../utils/error'
import fetch from 'superagent'

const log = logger('Authenticate')
const couchURL = 'http://62.210.236.128:5984'

export default req => new Promise((resolve, reject) => {

  const query = req.resourceURL.query

  if (!query.token) {
    log.error('No token found in query')
    return reject(authError('No token Found in query'))
  }

  fetch
    .get(`${couchURL}/sources/_design/application/_view/by-token?key=${query.token}`)
    .end((err, result) => {
      if (err) {
        log.error(err.message)
        return reject(err)
      }

      log(`CouchDB resolved with: ${result.statusCode}`)

      resolve(JSON.parse(result.text).rows[0].value)
    })
})
