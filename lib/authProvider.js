var NodePbkdf2 = require('node-pbkdf2')
var User = require('../models/User')
var LDString = require('../lib/LDString')

var hasher = new NodePbkdf2({ iterations: 10000, saltLength: 12, derivedKeyLength: 30 })

var authProvider = {
	authenticate: function(req, cb) {
		var email = req.params.email
		var password = req.params.password
		
		// Sanitize email address
		email = LDString.clean(email, false, false)
		if(!email || !LDString.validator.isEmail(email)) {
			if(cb) cb('Email address invalid')
			return
		}
		
		User.findOne({email: email, active: true}, function(err, u) {
			if(err) { // Database error
				if(cb) cb(true)
				return
			}
			
			if(!u) { // User not found
				if(cb) cb('Email or password wrong')
				return
			}
			
			hasher.checkPassword(password, u.password, function(err, status) {
				// TODO: keep track of failed attempts
				if(!status) { // Password mismatch
					if(cb) cb('Email or password wrong')
					return
				}
				
				if(cb) cb(false, u)
			})
		})
	},
	
	addUser: function(req, cb) {
		var email = req.params.email
		var password = req.params.password
		
		// Sanitize input
		email = LDString.clean(email, false, false)
		if(!email || !LDString.validator.isEmail(email)) {
			if(cb) cb('Email address invalid')
			return
		}
		
		password = LDString.cleanPassword(password)
		if(!password) {
			if(cb) cb('Password must be 8 characters or longer')
			return
		}
		
		// Check if email address is already registered
		User.findOne({email: email}, function(err, found) {
			if(err) { // Database error
				if(cb) cb(true)
				return
			}
			
			// Email already in use
			if(found) {
				if(cb) cb('Email already in use')
				return
			}
			
			// Hash the password
			hasher.encryptPassword(password, function (err, hashedPassword) {
				// Create user and store into database
				var u = new User({email: email, password: hashedPassword, active: true})
				u.save(function(err) {
					if(err) { // Database error
						if(cb) cb(true)
						return
					}
					if(cb) cb(false, u)
				})
			})
		})
		
	}
}

module.exports = authProvider
