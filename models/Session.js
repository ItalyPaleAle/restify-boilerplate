var mongoose = require('mongoose')
var Schema = mongoose.Schema

var sessionSchema = new Schema({
	// Elements in this collection are removed after 6 hours (21600s) after expire date
	_id: { type: String, required: true, index: { unique: true } },
	user: { type: Schema.Types.ObjectId },
	expire: { type: Date, expires: 21600 }
})

module.exports = mongoose.model('Session', sessionSchema)
