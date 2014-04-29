var NodePbkdf2 = require('node-pbkdf2')
var User = require('../models/User')

var authProvider = {
	authenticate: function(req, cb) {
		var email = req.params.email
		var password = req.params.password
		
		User.findOne({email: email, active: true}, function(err, u) {
			if(err || !u) {
				if(cb) cb('Email or password wrong')
				return
			}
			
			var hasher = new NodePbkdf2({ iterations: 10000, saltLength: 12, derivedKeyLength: 30 })
			hasher.checkPassword(password, u.password, function(err, status) {
				if(!status) {
					if(cb) cb('Email or password wrong')
					return
				}
				
				// Remove password
				u.password = ''
				if(cb) cb(false, u)
			})
		})
	}
}

module.exports = authProvider
