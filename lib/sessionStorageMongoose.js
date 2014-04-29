var mongoose = require('mongoose')
var Session = require('../models/Session')

var sessionStorage = {
	requireSignedTokens: false,
	
	find: function(token, cb) {
		Session.findById(token, function(err, userSession) {
			if(err || !userSession) {
				if(cb) cb(false)
				return
			}
			if(cb) cb(userSession.user, userSession.expire)
		})
	},
	
	add: function(token, cb) {
		var parts = token.split('.')
		if(!parts || parts.length < 3) {
			if(cb) cb(false)
			return
		}
		var user = parts[0]
		var expire = parseInt(parts[2])
		
		var userSession = new Session({
			_id: token,
			user: new mongoose.Types.ObjectId(user),
			expire: new Date(expire * 1000)
		})
		userSession.save(function(err) {
			if(cb) cb(err ? false : true)
		})
	},
	
	remove: function(token, cb) {
		Session.remove({_id: token}, function(err) {
			if(cb) cb(err ? false : true)
		})
	}
}

module.exports = sessionStorage
