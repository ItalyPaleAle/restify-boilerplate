var fs = require('fs')
var restify = require('restify')

// Load environments
var config = require(__dirname + '/lib/environment')()

var server = restify.createServer({
	
	// Uncomment to enable SSL
	/*certificate: fs.readFileSync('ssl/ssl-cert.pem'),
	key: fs.readFileSync('ssl/ssl-key.pem'),*/
	
	name: 'restify-boilerplate',
	version: '1.0.0'
})

server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/echo/:name', function (req, res, next) {
	res.send(req.params)
	return next()
})

server.listen(config.httpPort, function () {
	console.log('%s listening at %s', server.name, server.url)
})