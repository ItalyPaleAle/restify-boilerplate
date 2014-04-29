var sessionStorage = {
	// In-memory DB
	_db: [],
	
	find: function(token, cb) {
		//console.log('sessionStorage.find', this._db)
		
		var index = this._db.indexOf(token)
		if(index < 0) {
			if(cb) cb(false)
			return
		}
		
		var parts = token.split('.')
		if(!parts || parts.length < 3) {
			if(cb) cb(false)
			return
		}
		
		// parts[0] = user, parts[2] = expire
		if(cb) cb(parts[0], parseInt(parts[2]))
	},
	
	add: function(token, cb) {
		var index = this._db.indexOf(token)
		if(index < 0)
			this._db.push(token)
		
		//console.log('sessionStorage.add', this._db)
		
		if(cb) cb(true)
	},
	
	remove: function(token, cb) {
		var index = this._db.indexOf(token)
		if(index < 0) {
			if(cb) cb(false)
			return
		}
		this._db.splice(index, 1)
		
		//console.log('sessionStorage.remove', this._db)
		
		if(cb) cb(true)
	}
}

module.exports = sessionStorage
