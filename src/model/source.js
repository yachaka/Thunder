
import logger from '../utils/logger'
import fetch from 'superagent'

const couchURL = 'http://62.210.236.128:5984'

const log = logger('Source Model')

export const createSource = () => {}

export const deleteSource = () => {}

export const updateSource = () => {}

/*
 * Resolve a Source, given an Token
 *
 * TODO:
 *
 * Filter the data that will be resolved, to avoid sending any private info
 * by accident
 *
 * There should be a sourceFilter function and a sourceValidation function
 */
export const getSource = {
  byToken (token) {
    return new Promise((resolve, reject) => {

      fetch
        .get(`${couchURL}/sources/_design/application/_view/by-token?key=${token}`)
        .end((err, result) => {
          if (err) {
            log.error(err.message)
            return reject(err)
          }

          log(`CouchDB resolved with: ${result.statusCode}`)

          resolve(JSON.parse(result.text).rows[0].value)
        })
    })
  },

  byID () {},

  byName () {},
}
