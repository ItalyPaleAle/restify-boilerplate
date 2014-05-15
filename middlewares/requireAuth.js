module.exports = function(server, restify) {
	return function (req, res, next) {
		if(!server.session.isAuthenticated) {
			next(new restify.NotAuthorizedError('This resource requires authentication'))
		}
		else {
			next()
		}
	}
}
