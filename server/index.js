
import { server as WServer } from 'websocket'
import http from 'http'

const httpServer = http.createServer((req, res) => {

  console.log(`[${new Date()}] Received a request for ${req.url}`)

  res.writeHead(404)
  res.end()
})

httpServer.listen(3005, () => {
  console.log(`[${new Date()}] Server is listening on port 3000`)
})

const wserver = new WServer({
  httpServer,
  autoAcceptConnections: false,
})

const originIsAccepted = origin => true

wserver.on('error', e => console.log(e))

wserver.on('request', req => {

  if (!originIsAccepted(req.origin)) {
    request.reject()
    return console.log(`[${new Date()}] Connection refused from ${connection.remoteAddress}`)
  }

  const connection = req.accept(
    'echo-protocol',
    req.origin
  )

  console.log(`[${new Date()}] Connection accepted from ${connection.remoteAddress}`)

  connection.on('message', message => {
    if (message.type === 'utf8') {
      console.log(`[${new Date()}] Message from ${connection.remoteAddress}: ${message.utf8Data}`)
      connection.sendUTF(message.utf8Data)
    }

    else if (message.type === 'binary') {
      console.log(`[${new Date()}] Binary received from ${connection.remoteAddress} : ${message.binaryData.length}B`)
      connection.sendBytes(message.binaryData)
    }
  })

  connection.on('error', e => console.log(e))

  connection.on('close', (reason, description) => {
    console.log(`[${new Date()}] Peer ${connection.remoteAddress} disconnected`)
  })
})
