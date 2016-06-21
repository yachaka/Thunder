
import Subscriber from './Subscriber'

export default payload =>
  Subscriber.list
    .filter(s => s.want(payload))
    .forEach(s => s.send(payload))
