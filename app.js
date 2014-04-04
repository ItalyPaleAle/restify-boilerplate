var restify = require('restify')

// Load environments
var config = require(__dirname + '/lib/environment')()

var server = restify.createServer({
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