var authProvider = require('../lib/authProvider')

module.exports = function(server, restify){
	server.post('/adduser', function (req, res, next) {
		authProvider.addUser(req, function(err, user) {
			if(err) {
				return next(
					(typeof err == 'string')
					? new restify.InvalidArgumentError(err)
					: new restify.InternalError('Cannot add user')
				)
			}
			
			res.send({result: 1, user: user._id})
			next()
		})
	})
}
