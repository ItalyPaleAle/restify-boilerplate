var NodePbkdf2 = require('node-pbkdf2')
var User = require('../models/User')

var hasher = new NodePbkdf2({ iterations: 10000, saltLength: 12, derivedKeyLength: 30 })

var authProvider = {
	authenticate: function(req, cb) {
		var email = req.params.email
		var password = req.params.password
		
		User.findOne({email: email, active: true}, function(err, u) {
			if(err || !u) {
				if(cb) cb('Email or password wrong')
				return
			}
			
			hasher.checkPassword(password, u.password, function(err, status) {
				if(!status) {
					if(cb) cb('Email or password wrong')
					return
				}
				
				// Remove password
				u.password = undefined
				if(cb) cb(false, u)
			})
		})
	},
	
	addUser: function(req, cb) {
		var email = req.params.email
		var password = req.params.password
		
		if(!email || !password) { // TODO: validate email
			if(cb) cb(true)
			return
		}
		
		User.findOne({email: email}, function(err, found) {
			if(err) {
				if(cb) cb(true)
				return
			}
			
			// Email already in use
			if(found) {
				if(cb) cb('Email already in use')
				return
			}
			
			hasher.encryptPassword(password, function (err, hashedPassword) {
				var u = new User({email: email, password: hashedPassword, active: true})
				u.save(function(err) {
					if(err) {
						if(cb) cb(true)
						return
					}
					// Remove password
					u.password = undefined
					if(cb) cb(false, u)
				})
			})
		})
		
	}
}

module.exports = authProvider
