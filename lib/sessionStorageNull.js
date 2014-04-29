// This session storage does nothing, but it can be used with signed tokens

var sessionStorage = {
	requireSignedTokens: true,
	
	find: function(token, cb) {
		var parts = token.split('.')
		if(!parts || parts.length < 3) {
			if(cb) cb(false)
			return
		}
		
		// parts[0] = user, parts[2] = expire
		if(cb) cb(parts[0], parseInt(parts[2]))
	},
	
	add: function(token, cb) {
		if(cb) cb(true)
	},
	
	remove: function(token, cb) {
		if(cb) cb(true)
	}
}

module.exports = sessionStorage
