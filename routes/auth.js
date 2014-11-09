var authProvider = require('../lib/authProvider')

module.exports = function(server, restify){
	
	var requireAuth = require('../middlewares/requireAuth')(server, restify)
	
	/*!
	 POST /auth
	 Start a new session.
	 
	 POST parameters:
	 	* email (string): user email
	 	* password (string): user password
	 
	 Response:
	 	* result (int): 1 for success
	 
	 pjax: no
	 require auth: no
	*/
	server.post('/auth', function (req, res, next) {
		var session = server.session
		
		authProvider.authenticate(req, function(err, user) {
			if(err) {
				return next(new restify.InvalidCredentialsError(err))
			}
			
			session.create(user._id, function(token) {
				if(!token)
					return next(new restify.InternalError('Cannot start the session'))
				
				session.sendHeader(res, token)
				
				res.send({result: 1})
				next()
			})
		})
	})
	
	/*!
	 GET /auth/destroy
	 Destroy a session.
	 	 
	 Response:
	 	* result (int): 1 for success
	 
	 pjax: no
	 require auth: yes
	*/
	server.get('/auth/destroy', requireAuth, function (req, res, next) {
		// TODO: destroy all sessions for current user
		server.session.destroy(server.session.sessionToken, function(result) {
			if(!result)
				return next(new restify.InternalError('Cannot destroy the session'))
			
			// Respond with an empty session header
			server.session.sendHeader(res, '')
			
			res.send({result: 1})
			next()	
		})
	})
	
	/*!
	 GET /auth/refresh
	 Dummy request to keep the session alive
	 	 
	 Response:
	 	* result (int): 1 for success
	 
	 pjax: no
	 require auth: yes
	*/
	server.get('/auth/refresh', requireAuth, function (req, res, next) {
		res.send({result: 1})
		next()
	})
}
