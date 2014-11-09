var unorm = require('unorm')
var validator = require('validator')

var LDString = {
	
	// Bundle validator.js in this object
	validator: validator,
	
	clean: function(str, keepHTML, keepNewLines) {
		if(!str) return ''
		
		str = unorm.nfc(str)
		if(!str) return ''
		
		str = validator.stripLow(str, keepNewLines)
		
		if(!keepHTML) {
			str = validator.escape(str)
		}
		
		return str
	},
	
	cleanEmail: function(str) {
		str = this.clean(str, false, false)
		if(!str) return ''
		
		if(!validator.isEmail(str)) return ''
		
		// Lowercase the domain
		var parts = email.split('@', 2)
		parts[1] = parts[1].toLowerCase()
		
		return parts.join('@')
	},
	
	cleanPassword: function(str) {
		if(!str) return ''
		
		// Allow only ASCII characters between 0x20 and 0x7E, excluding control characters
		str = validator.whitelist(str, '\x20-\x7E')
		
		// Require 8 characters or longer
		if(str.length < 8) {
			return ''
		}
		
		return str
	},
	
	// Source: https://github.com/kvz/phpjs/blob/6a322e439bb66d1ef3ab9791c1de42b207090bd4/functions/strings/strip_tags.js
	stripTags: function(input, allowed) {
		//  discuss at: http://phpjs.org/functions/strip_tags/
		// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// improved by: Luke Godfrey
		// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//    input by: Pul
		//    input by: Alex
		//    input by: Marc Palau
		//    input by: Brett Zamir (http://brett-zamir.me)
		//    input by: Bobby Drake
		//    input by: Evertjan Garretsen
		// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Onno Marsman
		// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Eric Nagel
		// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// bugfixed by: Tomasz Wesolowski
		//  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
		//   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
		//   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
		//   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
		//   returns 2: '<p>Kevin van Zonneveld</p>'
		//   example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>")
		//   returns 3: "<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>"
		//   example 4: strip_tags('1 < 5 5 > 1')
		//   returns 4: '1 < 5 5 > 1'
		//   example 5: strip_tags('1 <br/> 1')
		//   returns 5: '1  1'
		//   example 6: strip_tags('1 <br/> 1', '<br>')
		//   returns 6: '1 <br/> 1'
		//   example 7: strip_tags('1 <br/> 1', '<br><br/>')
		//   returns 7: '1 <br/> 1'
		
		allowed = (((allowed || '') + '')
			.toLowerCase()
			.match(/<[a-z][a-z0-9]*>/g) || [])
			.join('') // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
		
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
		
		return input.replace(commentsAndPhpTags, '')
			.replace(tags, function ($0, $1) {
				return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
			})
	}
	
	/*// Inspired by http://www.php.net/manual/en/function.utf8-encode.php#85866
	// Ported from PHP
	_validUtf8: function(string) {
		return string.match(/^([\x09\x0A\x0D\x20-\x7E]|[\xC2][\xA0-\xBF]|[\xC3-\xDF][\x80-\xBF]|\xE0[\xA0-\xBF][\x80-\xBF]|[\xE1-\xEC\xEE\xEF][\x80-\xBF]{2}|\xED[\x80-\x9F][\x80-\xBF]|\xF0[\x90-\xBF][\x80-\xBF]{2}|[\xF1-\xF3][\x80-\xBF]{3}|\xF4[\x80-\x8F][\x80-\xBF]{2})*$/)
	}*/
}

module.exports = LDString
