
/* eslint-disable no-console */

import chalk from 'chalk'

const log = (c, f) => m =>
  console.log(chalk[c](`[${new Date()} - ${f}]`), m)

/*
 * const log = logger('Logger')
 *
 * log('Hello') // [Mon Jun 20 2016 14:53:39 GMT+0200 (CEST) - Logger] Hello
 * log.warn('Warning blablabl')
 * log.error('Cannot find this')
 * log.validate('Ok')
 */
export default file => Object.assign(
  log('blue', file),
  {
    error: log('red', file),
    validate: log('green', file),
    warn: log('yellow', file),
  }
)

/* eslint-enable no-console */
