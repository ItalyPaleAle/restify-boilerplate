var mongoose = require('mongoose')
var Schema = mongoose.Schema

var sessionSchema = new Schema({
    _id: { type: String, required: true, index: { unique: true } },
    user: Schema.Types.ObjectId,
    expire: Date
})

module.exports = mongoose.model('Session', sessionSchema)
