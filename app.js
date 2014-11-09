var fs = require('fs')
var restify = require('restify')
var session = require('./lib/session')
var mongoose = require('mongoose')
var CORS = require('./lib/CORS')

// Load environments
var config = require(__dirname + '/lib/environment')()

var server = restify.createServer({
	
	// Uncomment to enable SSL
	/*certificate: fs.readFileSync('ssl/ssl-cert.pem'),
	key: fs.readFileSync('ssl/ssl-key.pem'),*/
	
	name: 'restify-boilerplate',
	version: '1.0.0',
	
	// Enable PJAX
	formatters: {
		'application/pjax; q=0.1': require('lib/PJAX')(__dirname + '/views', {global: 1})
	}
})

// Database connection
mongoose.connect(config.mongodb)

// Save the config, session and mongoose objects in the server
server.appConfig = config
server.session = session
server.mongoose = mongoose

// Exception handling
server.on('uncaughtException', function (req, res, route, err) {
	console.error('uncaughtException: %s', err.stack)
	res.send(new restify.InternalError('An unexpected error occurred'))
})

// Some builtin (restify) middlewares
server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.gzipResponse())
server.pre(restify.pre.sanitizePath()) // Sanitize paths like //foo/////bar// to /foo/bar

// Enable Cross-Origin Resource Sharing (CORS)
CORS(server, {
	origins: config.allowOrigin ? config.allowOrigin : false,
	headers: ['X-Session-Token'],
	exposeHeaders: ['X-Session-Token']
})

server.pre(function(req, res, next) {
	// Cleanup path
	restify.pre.sanitizePath()
	
	// Return some headers
	if (!res.getHeader('Server')) res.setHeader('Server', res.serverName)
	if (res.version && !res.getHeader('X-Api-Version')) res.setHeader('X-Api-Version', res.version)
	if (!res.getHeader('X-Request-Id')) res.setHeader('X-Request-Id', req.getId())
	
	// Initialize session
	var token = req.header('X-Session-Token', '')
	session.init(token, function(userId) {
		//console.log(session.isAuthenticated ? 'Authenticated: ' + session.isAuthenticated : 'NOT Authenticated')
		if(session.isAuthenticated) {
			session.refreshIfNeeded(res, token, function() {
				// Load user data here
				next()
			})
		}
		else { // if(session.isAuthenticated)
			next()
		}
	})
})

// Routing
require('./routes')(server, restify)

// Start the server
server.listen(config.httpPort, function () {
	console.log('%s listening at %s', server.name, server.url)
})
