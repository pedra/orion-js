/* MAIN JAVASCRIPT FILE
 ---------------------------------------------------------------------- */

const APP_ID = 'W5API'
const APP_VERSION = '0.0.1'
const URL_AVATAR = location.origin + '/media'

const API_URL = 'https://e-wallet.tk' //location.origin
const API_URL_KEY = API_URL + '/key'
const API_URL_LOGIN = API_URL + '/login'
const API_URL_TOKEN = API_URL + '/token'
const API_URL_GATE = API_URL + '/gate'

var MAIN_PAGE = 'home'
var LOGIN_PAGE = 'login'

const SWORKER = {
	pushdata: null,
	SW: null
}

var TMP, TMP1, TMP2

window.onload = () => {
	glass(false)

	//Instalando o Service Worker
	if ('serviceWorker' in navigator) {
		// 	// navigator.serviceWorker.addEventListener('message', e => {
		// 	// 	console.log('SWMessage:', e.data)
		// 	// 	SWORKER.pushdata.push(e.data)
		// 	// })

		navigator.serviceWorker.register(location.origin + '/sw.js', {scope: './'}).then(sw => (SWORKER.SW = sw))
	} else {
		report(
			'Seu navegador não suporta essa aplicação.<b>Atualize seu navegador ou instale um mais moderno como o Chrome ou Firefox.'
		)
	}

	// Inicializando
	PERSON.init()
	ME.init(MAIN_PAGE, LOGIN_PAGE)
}
