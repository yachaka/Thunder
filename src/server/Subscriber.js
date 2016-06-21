
/*
 * At the moment,
 * the subscribers are all stroed in RAM,
 * it might be the only serious solution for performances,
 * not scalability. Lets test with Redis
 */
class Subscriber {

  /*
   * All Subscribers are stored in this array that might become huge,
   * Alert Scalability! Alert Availability! Alert Performance!
   */
  static list = []

  /*
   * The connection is automatically accepted..
   * The subscriber cannot send anything to the server, sooo...
   *
   * The subscriber has to connect to the server with a querystring
   * describing what the stream wants to listen to:
   *
   * ?listen=facebook+twitter+gplus
   */
  constructor (req) {

    this.connection = req.accept('echo-protocol', req.origin)
    this.event = req.resourceURL.query.listen.split('+')

    Subscriber.list.push(this)
  }

  /*
   * Used to check wether the subscriber
   * wants to be sent the payload
   * Should return a Boolean
   */
  want (payload) {
    return this.event.includes(payload.name)
  }

  /*
   * Used the stored connection to send
   * the payload to the client
   */
  send (payload) {
    this.connection.sendUTF(JSON.stringify(payload))
  }

}

export default Subscriber
