
import 'local-modules-as-globals/register'

import express from 'express'
import bodyParser from 'body-parser'

const server = express()
express.use(bodyParser.json())
express.use(bodyParser.url({extended: true}))

express.post('/feed', authenticateSource, (req, res) => {

})

server.listen(8080, () => console.log('✓ Listening at :8080'))
