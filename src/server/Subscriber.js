
class Subscriber {

  static list = []

  constructor (req) {

    this.connection = req.accept('echo-protocol', req.origin)
    this.event = req.resourceURL.query.listen.split('+')

    Subscriber.list.push(this)
  }

  want (payload) {
    return this.event.include(payload.name)
  }

  send (payload) {
    this.connection.sendUTF(JSON.stringify(payload))
  }

}

export default Subscriber
