var authProvider = require('../lib/authProvider')

module.exports = function(server, restify){
	
	var requireAuth = require('../middlewares/requireAuth')(server, restify)
	
	server.post('/auth', function (req, res, next) {
		var session = server.session
		
		authProvider.authenticate(req, function(err, user) {
			if(err) {
				return next(new restify.InvalidCredentialsError(err))
			}
			
			session.create(user._id, function(token) {
				if(!token)
					return next(new restify.InternalError('Cannot start the session'))
				
				session.sendHeader(res, token)
				
				res.send({result: 1})
				next()
			})
		})
	})
	
	// Destroy session
	server.get('/auth/destroy', requireAuth, function (req, res, next) {
		server.session.destroy(server.session.sessionToken, function(result) {
			if(!result)
				return next(new restify.InternalError('Cannot destroy the session'))
			
			// Respond with an empty session header
			session.sendHeader(res, '')
			
			res.send({result: 1})
			next()	
		})
	})
}
