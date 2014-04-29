var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
	email: { type: String, required: true, index: { unique: true } },
	password: String,
	active: Boolean
})

module.exports = mongoose.model('User', userSchema)
