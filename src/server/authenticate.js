
import logger from '../utils/logger'
import { authError } from '../utils/error'
import { getSource } from '../model/source'

const log = logger('Authenticate')

export default req => {

  const query = req.resourceURL.query

  if (!query.token) {
    log.error('No token found in query')
    return Promise.reject(authError('No token Found in query'))
  }

  log('Retrieving Source...')

  return getSource.byToken(query.token)
}
