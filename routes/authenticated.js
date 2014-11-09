module.exports = function(server, restify){

	var requireAuth = require('../middlewares/requireAuth')(server, restify)
	
	/*!
	 GET /authenticated
	 Sample request.
	 	 
	 Response:
	 	* hello (int): id of authenticated user
	 
	 pjax: no
	 require auth: yes
	*/
	server.get('/authenticated', requireAuth, function (req, res, next) {
		res.send({hello: server.session.isAuthenticated}) // User id
		return next()
	})
}
