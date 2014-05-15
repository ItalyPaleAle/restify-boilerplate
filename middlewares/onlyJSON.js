module.exports = function(server, restify) {
	return function (req, res, next) {
		if(!req.accepts('application/json')) {
			return next(new restify.WrongAcceptError('This resource only provides JSON responses'))
		}
		else {
			next()
		}
	}
}
