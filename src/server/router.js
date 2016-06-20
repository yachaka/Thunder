
const method = name => (path, cb) => ({ [`${name} ${path}`]: cb })

const get = method('GET')
const post = method('POST')

export default Object.assign(
  get('/feed', () => true),
  post('/feed', () => false)
)
