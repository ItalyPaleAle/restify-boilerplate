var crypto = require('crypto')
// Choose which session storage: mongoose, memory, null
var sessionStorage = require('./sessionStorage/mongoose')

var kSessionExpire = 1800 // 30 minutes
var kSessionRefresh = 600 // 10 minutes
var kSessionKey = 'Ei fu, siccome immobile dato il mortal sospiro...'
var kSignedTokens = false // You must use signed tokens with the "null" session storage; in all other cases, it just provides some additional (probably unnecessary) security

function signToken(user, seed, expire) {
	return crypto.createHash(kSignedTokens ? 'sha256' : 'sha1').update(user + seed + expire + kSessionKey).digest('hex')
}

var session = {
	isAuthenticated: false,
	sessionToken: false,
	
	// Methods
	init: function(token, cb) {
		var that = this
		
		if(sessionStorage.requireSignedTokens && !kSignedTokens) {
			throw new Error('Session storage requires signed tokens')
			return
		}
		
		if(!token) {
			that.isAuthenticated = false
			if(cb) cb(false)
		}
		else {
			if(kSignedTokens) {
				var parts = token.split('.')
				if(!parts || parts.length < 4) {
					if(!result) throw new Error('Invalid session token format')
					return
				}
				
				var user = parts[0]
				var signature = parts[1]
				var expire = parseInt(parts[2])
				var seed = parts[3]
				
				var checkSignature = signToken(user, seed, expire)
				if(signature !== checkSignature) {
					that.isAuthenticated = false
					if(cb) cb(that.isAuthenticated)
				}
			}
			
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
						that.sessionToken = token
						if(cb) cb(that.isAuthenticated)
					}
				}
			})
		}
	},
	
	create: function(user, cb) {
		var seed = crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex')
		var expire = (Date.now() / 1000 + kSessionExpire).toFixed(0)
		var hash = signToken(user, seed, expire)
		
		var parts = [user, hash, expire]
		if(kSignedTokens) {
			parts.push(seed)
		}
		
		var token = parts.join('.')
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
		if(!parts || parts.length < 3) {
			if(!result) throw new Error('Invalid session token format')
			return
		}
		
		var tokenUser = parts[0]
		var tokenDate = parseInt(parts[2])
		
		var now = Date.now() / 1000
		var refresh = tokenDate - kSessionExpire + kSessionRefresh
		if(now > refresh) {
			sessionStorage.remove(token, function(result) {
				if(!result) throw new Error('Cannot remove expired session')
				
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
