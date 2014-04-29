var NodePbkdf2 = require('node-pbkdf2')

var authProvider = {
	authenticate: function(req, cb) {
		var email = req.params.email
		var password = req.params.password
		
		var hasher = new NodePbkdf2({ iterations: 10000, saltLength: 12, derivedKeyLength: 30 })
		
		var user = false
		
		if(email == 'test@me.com' && password == 'test')
			user = {"_id":"534b209cf6b8c502104f6cbc","email":"test@me.com","password":"JzBr0BMMxF2m::ZbnkGFeM6xCTzuzhsF/k3tMf09T5h7aChOERcy7h::30::10000"}
		
		if(!user) {
			if(cb) cb('Email or password wrong')
			return
		}
		
		hasher.checkPassword(password, user.password, function(err, status) {
			if(!status) {
				if(cb) cb('Email or password wrong')
				return
			}
			
			// Remove password
			user.password = ''
			if(cb) cb(false, user)
		})
	}
}

module.exports = authProvider
