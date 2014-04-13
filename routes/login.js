var NodePbkdf2 = require('node-pbkdf2')

module.exports = function(server, restify){
	server.post('/login', function (req, res, next) {
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
			
			var token = session.create(user._id)
			session.sendHeader(res, token)
			
			res.send({result: 1})
			next()
		})
	})
}
