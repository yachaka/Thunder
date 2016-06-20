
/* eslint-disable no-console */

import chalk from 'chalk'

const log = (c, f) => m =>
  console.log(chalk[c](`[${new Date()} - ${f}]`), m)

export default file => Object.assign(
  log('blue', file),
  {
    error: log('red', file),
    validate: log('green', file),
    warn: log('yellow', file),
  }
)

/* eslint-enable no-console */
