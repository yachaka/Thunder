
import superagent from 'superagent'
import promisePlugin from 'superagent-promise-plugin'

export default promisePlugin.patch(superagent)