
import 'local-modules-as-globals/register'

import express from 'express'
import bodyParser from 'body-parser'

import couchDB from '@config/couchDB'
import request from '@config/request'
import authenticateSource from '@middlewares/authenticateSource'

const server = express()
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.post('/feed', authenticateSource, (req, res, next) => {
	if (Object.keys(req.body).length == 0)
		return next(new Error('Empty body in request'))
	console.log(req.source)
	emit(req.source.name, req.body)
	res.end()
})

let functions = {
	sports: (data) => {
		if (data.tag && data.tag == 'sports')
			return { ...data, processedBy: 'sportsLOL'}
	}
}

function emit(who, data) {
	request
		.get(`${couchDB.url}/subscribers/_design/application/_view/by-name?key="${who}"`)
		.accept('json')
		.then((res) => {
			console.log(who, res.body.rows)
			if (res.body.rows.length == 0)
				return console.log('End!', data)
			let subscribers = res.body.rows[0].value

			subscribers.forEach((sub) => {
				process.nextTick(() => run(sub, data))
			})

		})
		.catch(console.log)
}

function run(sub, data) {
	let processed = functions[sub](data)
	console.log(data)
	if (processed) {
		emit(sub, processed)
	}
}

server.use((err, req, res, next) => {
	console.error(err)
	next(err)
})
server.listen(8080, () => console.log('✓ Listening at :8080'))