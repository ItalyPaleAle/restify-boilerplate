var fs = require('fs')

var LDLog = {
	_handle: false,
	_period: false,
	_path: false,
	
	init: function(path) {
		this._path = path
	},
	
	write: function(/*req, array or ...*/) {
		if(!arguments || arguments.length < 2) {
			throw new Error('LDLog.write(): not enough parameters')
		}
		
		var args = Array.prototype.slice.call(arguments)
		var req = args.shift()
		if(args.length == 1 && args[0] instanceof Array) {
			args = args[0]
		}
		
		var now = new Date()
		this._ensureHandle(now)
		
		var hours = now.getUTCHours()
		var minutes = now.getUTCMinutes()
		var seconds = now.getUTCSeconds()
		var time = [
			(hours < 10) ? ('0' + hours) : hours,
			(minutes < 10) ? ('0' + minutes) : minutes,
			(seconds < 10) ? ('0' + seconds) : seconds
		].join('')
		
		var ip = this._remoteAddress(req)
		
		var meta = [
			time,
			(ip ? ip : '-'),
			(req.user ? req.user._id : '-'),
			(req.method ? req.method : '-'),
			(req.url ? req.url : '-')
		]
		
		if(req.headers['user-agent']) {
			args.push(req.headers['user-agent'])
		}
		
		this._handle.write(meta.join(' ') + ' ' + args.join(' ') + "\n")
	},
	
	_ensureHandle: function(now) {
		var month = (now.getUTCMonth() + 1)
		var day = now.getUTCDate()
		var period = [
			now.getUTCFullYear(),
			(month < 10) ? ('0' + month) : month,
			(day < 10) ? ('0' + day) : day
		].join('')
		
		if(!this._handle || period !== this._period) {
			if(this._handle) {
				this._handle.end()
			}
			this._handle = fs.createWriteStream(this._path + 'app_' + period + '.log', {'flags': 'a'})
			this._period = period
		}
	},
	
	// Get the IP of the user if available
	_remoteAddress: function(req) {
		if(req.ips && req.ips.length) return req.ips
		if(req.ip) return req.ip
		
		if(req._remoteAddress) return req._remoteAddress
		
		var sock = req.socket
		if(sock.socket) return sock.socket.remoteAddress
		
		return false
	}
}

module.exports = LDLog
