var NodePbkdf2 = require('node-pbkdf2')

module.exports = function(server, restify){
	server.post('/auth', function (req, res, next) {
		var session = server.session
		
		var email = req.params.email
		var password = req.params.password
		
		var hasher = new NodePbkdf2({ iterations: 10000, saltLength: 12, derivedKeyLength: 30 })
		
		var encryptedPassword = false
		var user = false
		
		if(email == 'test@me.com' && password == 'test')
			user = {"_id":"534b209cf6b8c502104f6cbc","email":"test@me.com","password":"JzBr0BMMxF2m::ZbnkGFeM6xCTzuzhsF/k3tMf09T5h7aChOERcy7h::30::10000"}
		
		if(!user) {
			return next(new restify.InvalidCredentialsError('Email or password wrong'))
		}
		
		var passwordStatus = false
		hasher.checkPassword(password, user.password, function(err, status) {
			passwordStatus = status
			
			if(!passwordStatus) {
				return next(new restify.InvalidCredentialsError('Email or password wrong'))
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
	server.get('/auth/destroy', function (req, res, next) {
		if(!server.session.isAuthenticated)
			return next(new restify.NotAuthorizedError('This resource requires authentication'))
		
		server.session.destroy(server.session.sessionToken, function(result) {
			if(!result)
				return next(new restify.InternalError('Cannot destroy the session'))
			
			res.send({result: 1})
			next()	
		})
	})
}
