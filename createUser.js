var NodePbkdf2 = require('node-pbkdf2')
var mongoose = require('mongoose')
var User = require('models/User')

mongoose.connect('mongodb://localhost/restify-boilerplate')

var hasher = new NodePbkdf2({ iterations: 10000, saltLength: 12, derivedKeyLength: 30 })

var email = process.argv[2] || false
var password = process.argv[3] || false

if(!email || !password) {
	console.log('Syntax: node createUser.js email@something.com password')
	mongoose.connection.close()
	return 1
}

hasher.encryptPassword(password, function (err, hashedPassword) {
	var u = new User({email: email, password: hashedPassword, active: true})
	u.save(function(err) {
		console.log('User '+email+' created')
		mongoose.connection.close()
	})
})