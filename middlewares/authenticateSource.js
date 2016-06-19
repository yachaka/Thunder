
import couchDB from '@config/couchDB'
import request from '@config/request'

export default (req, res, next) => {
	if (!req.headers.authorization)
		next(new Error('No authorization header found'))

	request
		.get(`${couchDB.url}/sources/_design/application/_view/by-token?key=${req.headers.authorization}`)
		.accept('json')
		.then((res) => {
			if (res.body.rows.length == 0)
				return next(new Error('Source unknown'))
			req.source = res.body.rows[0].value
			return next()
		})
		.catch(console.log)
}