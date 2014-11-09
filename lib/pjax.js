/* lib/PJAX.js
 
 Contains code from node-restify
 Source: https://github.com/mcavage/node-restify
 Copyright: (c)2012 Mark Cavage
 License: MIT
 
*/

function PJAX(path, global) {
	var dots = require('dot').process({path: path, global: global})
	
	return function (req, res, body) {
		if(body instanceof Error) {
			res.statusCode = body.statusCode || 500
			body = body.message
		}
		else if(typeof (body) === 'object' && !!res.pjax && typeof dots[res.pjax] !== 'undefined') {
			body = dots[res.pjax](body)
		}
		else {
			res.statusCode = 500
			body = 'Template not found'
		}
	
		res.setHeader('Content-Length', Buffer.byteLength(body))
		return (body)
	}
}

module.exports = PJAX
