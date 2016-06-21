
import Subscriber from './Subscriber'

/*
 * pretty self explanatory
 */
export default payload =>
  Subscriber.list
    .filter(s => s.want(payload))
    .forEach(s => s.send(payload))
