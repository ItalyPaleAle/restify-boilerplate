/* lib/CORS.js
 Inspired by se7ensky-restify-preflight
 Source: https://github.com/Se7enSky/se7ensky-restify-preflight
 License: MIT
 Permalink: https://github.com/Se7enSky/se7ensky-restify-preflight/blob/70de209f64d7624f46cd54eadfffec1aae14e403/index.js
*/
module.exports = function(server, opts) {
	// Access-Control-Allow-Headers
	var defaultHeaders = [
		'Accept',
		'Access-Control-Allow-Credentials',
		'Origin',
		'Content-Type',
		'Request-Id',
		'Server',
		'X-Api-Version',
		'X-Request-Id',
		'X-Requested-With'
	]
	var enabledHeaders = defaultHeaders.concat(opts.headers ? opts.headers : [])
	var headers = enabledHeaders.join(', ')
	
	// Access-Control-Expose-Headers
	var defaultExposeHeaders = [
		'Content-Type',
		'Request-Id',
		'Server',
		'X-Api-Version',
		'X-Request-Id',
		'X-Requested-With'
	]
	var enabledExposeHeaders = defaultExposeHeaders.concat(opts.exposeHeaders ? opts.exposeHeaders : [])
	var exposeHeaders = enabledExposeHeaders.join(', ')
	
	// Default middleware to enable CORS
	server.use(function(req, res, next) {
		if(req.headers['origin']) {
			if(!opts.origins ||
				(opts.origins instanceof Array && opts.origins.length < 1) ||
				(opts.origins && opts.origins.indexOf(req.headers['origin']) > -1) ||
				(opts.origins && opts.origins[0] == '*')
				) {
				res.header('Access-Control-Allow-Origin', req.headers['origin'])
			}
		}
		if(opts.allowCredentials) res.header('Access-Control-Allow-Credentials', 'true')
		res.header('Access-Control-Allow-Headers', headers)
		res.header('Access-Control-Expose-Headers', exposeHeaders)
		return next()
	})
	
	// Support for OPTIONS requests (for preflighted CORS requests)
	server.opts('.*', function(req, res, next) {
		if (req.headers.origin && req.headers['access-control-request-method']) {
			if(!opts.origins ||
				(opts.origins instanceof Array && opts.origins.length < 1) ||
				(opts.origins && opts.origins.indexOf(req.headers['origin']) > -1) ||
				(opts.origins && opts.origins[0] == '*')
				) {
				res.header('Access-Control-Allow-Origin', req.headers['origin'])
			}
			if(opts.allowCredentials) res.header('Access-Control-Allow-Credentials', 'true')
			res.header('Access-Control-Allow-Headers', headers)
			res.header('Access-Control-Expose-Headers', exposeHeaders)
			res.header('Allow', req.headers['access-control-request-method'])
			res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method'])
			if (req.log) {
				req.log.info({
					url: req.url,
					method: req.headers['access-control-request-method']
				}, 'Preflight')
			}
			res.send(204)
			return next()
		} else {
			res.send(404)
			return next()
		}
	})
}