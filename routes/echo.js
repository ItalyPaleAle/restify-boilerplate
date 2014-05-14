module.exports = function(server){
	server.get('/echo/:name', function (req, res, next) {
		res.pjax = 'echo'
		res.send({name: req.params.name})
		return next()
	})
}
