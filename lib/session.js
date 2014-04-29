var crypto = require('crypto')
var sessionStorage = require('./sessionStorageMemory') // Use in-memory DB

var kSessionExpire = 1800 // 30 minutes
var kSessionRefresh = 600 // 10 minutes

var session = {
	isAuthenticated: false,
	
	// Methods
	init: function(token, cb) {
		var that = this
		
		if(!token) {
			that.isAuthenticated = false
			if(cb) cb(false)
		}
		else {
			sessionStorage.find(token, function(user, expire) {
				if(!user) {
					that.isAuthenticated = false
					if(cb) cb(that.isAuthenticated)
				}
				else {
					var now = Date.now() / 1000
					if(now > expire) {
						that.isAuthenticated = false
						sessionStorage.remove(token, function(result) {
							if(!result) throw new Error('Internal error: cannot remove expired session')
							else if(cb) cb(that.isAuthenticated)
						})
					}
					else {
						that.isAuthenticated = user // This is the user._id
						if(cb) cb(that.isAuthenticated)
					}
				}
			})
		}
	},
	
	create: function(user, cb) {
		var key = 'Ei fu, siccome immobile dato il mortal sospiro...'
		var seed = crypto.randomBytes(20);
		var hash = crypto.createHash('sha1').update(seed + key).digest('hex')
		
		var token = [user, hash, (Date.now() / 1000 + kSessionExpire).toFixed(0)].join('.')
		sessionStorage.add(token, function(result) {
			if(cb) cb(result ? token : false)
		})
	},
	
	destroy: function(token, cb) {
		sessionStorage.remove(token, function(result) {
			if(!result) throw new Error('Internal error: cannot remove expired session')
			else if(cb) cb(true)
		})
	},
	
	refreshIfNeeded: function(res, token, cb) {
		var that = this
		
		var parts = token.split('.')
		if(!parts || parts.length < 3)
			return false
		
		var tokenUser = parts[0]
		var tokenDate = parts[2]
		
		var now = Date.now() / 1000
		var refresh = tokenDate - kSessionExpire + kSessionRefresh
		if(now > refresh) {
			sessionStorage.remove(token, function(result) {
				if(!result) throw new Error('Internal error: cannot remove expired session')
				
				that.create(tokenUser, function(newToken) {
					that.sendHeader(res, newToken)
					if(cb) cb(true)
				})
			})
		}
		else {
			if(cb) cb(true)
		}
	},
	
	sendHeader: function(res, token) {
		res.header('X-Session-Token', token)
	}
}

module.exports = session
