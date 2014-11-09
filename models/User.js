var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
	email: { type: String, required: true, index: { unique: true } },
	active: { type: Boolean, default: true },
	password: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema)
