module.exports = function(server){
	
	/*!
	 GET /echo/:name
	 Sample request with PJAX support
	 
	 Arguments:
	 	* name (string): a string
	 	 
	 Response:
	 	* name (int): the value of the :name argument
	 
	 pjax: yes
	 require auth: no
	*/
	server.get('/echo/:name', function (req, res, next) {
		res.pjax = 'echo'
		res.send({name: req.params.name})
		return next()
	})
}
