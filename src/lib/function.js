/*
 *  Utils
 */

const _ = e => document.querySelector(e) || false
const _a = e => document.querySelectorAll(e) || false
const _f = f => ('function' == typeof f ? f : () => null)
const tokey = n => ('number' == typeof n ? n : new Date().getTime()).toString(36)
const unkey = t => 'string' == typeof t ? parseInt(t, 36) : false
const rtof = v => parseFloat((v.trim() == ''? v = '0' : v).replace(/\.| /g, '').replace(/,/g, '.'))
const ftor = v => parseFloat(v).toLocaleString('pt-br', {minimumFractionDigits: 2})
const rpass = chars => {
	chars = 'undefined' == typeof chars || chars > 40 || chars < 0 ? 20 : chars
	var pass = '',
		ascii = [
			[48, 57],
			[64, 90],
			[97, 122]
		]
	for (var i = 0; i < chars; i++) {
		var b = Math.floor(Math.random() * ascii.length)
		pass += String.fromCharCode(Math.floor(Math.random() * (ascii[b][1] - ascii[b][0])) + ascii[b][0])
	}
	return pass
}
const stoh = t => t //stoh = String To Html
.replace(/([^\w]|\s|_|\-|)(\*([^/s]|.*?)\*)([^\w]|\s|_|\-|)/g, '$1<b>$3</b>$4')
.replace(/([^\w]|\s|\*|\-|)(\_([^/s]|.*?)\_)([^\w]|\s|\*|\-|)/g, '$1<i>$3</i>$4')
.replace(/([^\w]|\s|\*|_|)(\-([^/s]|.*?)\-)([^\w]|\s|\*|_|)/g, '$1<s>$3</s>$4')