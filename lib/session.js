var crypto = require('crypto')

var kSessionExpire = 1800 // 30 minutes
var kSessionRefresh = 600 // 10 minutes

var session = {
	isAuthenticated: false,
	
	// In-memory DB
	db: [],
	dbFind: function(token) {
		//console.log('dbFind', this.db)
		
		var index = this.db.indexOf(token)
		if(index < 0)
			return false
		
		var parts = token.split('.')
		if(!parts || parts.length < 3)
			return false
		
		return {user: parts[0], expire: parseInt(parts[2])}
	},
	dbAdd: function(token) {
		var index = this.db.indexOf(token)
		if(index < 0)
			this.db.push(token)
		
		//console.log('dbAdd', this.db)
	},
	dbRemove: function(token) {
		var index = this.db.indexOf(token)
		if(index < 0)
			return
		this.db.splice(index, 1)
		
		//console.log('dbRemove', this.db)
	},
	
	// Methods
	init: function(token) {
		if(!token) {
			this.isAuthenticated = false
		}
		else {
			var data = this.dbFind(token)
			if(!data) {
				this.isAuthenticated = false
			}
			else {
				var now = Date.now() / 1000
				if(now > data.expire) {
					this.isAuthenticated = false
					this.dbRemove(token)
				}
				else {
					this.isAuthenticated = data.user // This is the user._id
				}
			}
		}
	},
	
	create: function(user) {
		var key = 'Ei fu, siccome immobile dato il mortal sospiro...'
		var seed = crypto.randomBytes(20);
		var hash = crypto.createHash('sha1').update(seed + key).digest('hex')
		
		var token = [user, hash, (Date.now() / 1000 + kSessionExpire).toFixed(0)].join('.')
		this.dbAdd(token)
		
		return token
	},
	
	refreshIfNeeded: function(res, token) {
		var parts = token.split('.')
		if(!parts || parts.length < 3)
			return false
		
		var tokenUser = parts[0]
		var tokenDate = parts[2]
		
		var now = Date.now() / 1000
		var refresh = tokenDate - kSessionExpire + kSessionRefresh
		if(now > refresh) {
			this.dbRemove(token)
			var newToken = this.create(tokenUser)
			this.sendHeader(res, newToken)
		}
	},
	
	sendHeader: function(res, token) {
		res.header('X-Session-Token', token)
	}
}

module.exports = session
