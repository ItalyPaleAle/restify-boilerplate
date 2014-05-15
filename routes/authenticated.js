module.exports = function(server, restify){
	
	var requireAuth = require('../middlewares/requireAuth')(server, restify)
	
	server.get('/authenticated', requireAuth, function (req, res, next) {
		res.send({hello: server.session.isAuthenticated}) // User id
		return next()
	})
}
