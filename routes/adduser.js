var authProvider = require('../lib/authProvider')

module.exports = function(server, restify){
	
	/*!
	 POST /adduser
	 Create a new user.
	 
	 POST parameters:
	 	* email (string): email of the user to create
	 	* password (string): password of the user (>= 8 characters, all ASCII standard between 0x20-0x7F)
	 
	 Response:
	 	* result (int): 1 for success
	 	* user (string): MongoId of the created user
	 
	 pjax: no
	 require auth: no
	*/
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
