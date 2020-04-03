/*
 * This function is to report a message to the user.
 * The following is a very simple example.
 */
const report = (id, type) => {
	type = type || 'alert'
	msg = [
		'The public key was not obtained! <br> Check the internet connection.',
		'You need to enter your login',
		'Type the password',
		'The Local Key was not generated!',
		'Check your login and password!',
		'Connected with SUCCESS!',
		'Unplugged',
		'I was unable to get the public key from the server :(',
		'I was unable to connect to the server!'
	]
	return alert(msg[id])
}

/*
 * This function is to place a "gif loader" on the screen
 * to block the user's action while loading/sending data from the server.
 */
const glass = g => null

/* GATEWAY
   ----------------------------------------------------------------------------
 * Gate static object
 * 
 * Usage:
 * 
 * First, start the GATE static object
 * 		GATE.init(Page.Home, Page.Login, null, null, null, null, report, glass)
 * 
 * If successful, call the home page (external function "homePage"). 
 * Otherwise, it calls the LOGIN page.
 * 
 * 		GATE.login('your login', 'your password') -> 
 * 		GATE.logout() -> to clear access data (logout)
 * 
 * Simple GET/POST method using fetch.
 * "Callback" receives the error and the resulting data [callback (error, data)].
 * 
 * 		GATE.get(url, callback)
 * 		GATE.post(url, data, callback)
 * 
 */
const GATE = {
	// Application
	app_id: 'Orion-sample',
	app_version: '0.0.1',

	// Server api url
	keyUrl: '/key',
	loginUrl: '/login',
	gateUrl: '/gate',

	// Check token settings
	controller: 'Gate',
	chkTokenAction: 'CheckToken',
	logoutAction: 'Logout',

	// External functions
	loginPage: () => null,
	homePage: () => null,
	report: () => null,
	glass: () => null,

	// Persistence settings
	configUrl: '/config',
	id: 0,
	rsa: '',
	token: '',
	ukey: '',

	init: (homePage, loginPage, configUrl, keyUrl, loginUrl, gateUrl, report, glass) => {
		GATE.homePage = 'function' == typeof homePage ? homePage : () => null
		GATE.loginPage = 'function' == typeof loginPage ? loginPage : () => null
		GATE.report = 'function' == typeof report ? report : () => null
		GATE.glass = 'function' == typeof glass ? glass : () => null

		GATE.configUrl = configUrl || '/config'
		GATE.keyUrl = keyUrl || '/key'
		GATE.loginUrl = loginUrl || '/login'
		GATE.gateUrl = gateUrl || '/gate'

		// Carregando configuração do Cache Storage
		GATE.load(e, data => {
			if (e !== false) {
				GATE.ukey = rpass() // Gerando a chave local para AES
				return GATE.loginPage()
			}

			GATE.id = data.id
			GATE.ukey = data.ukey
			GATE.token = data.token

			return GATE.isValidToken()
		})
	},

	social: target => null, // social networks login (to do)
	login: (login, passwd) => GATE.getPublicKey(rsa => GATE.log(login, passwd)),
	log: (login, passwd) => {
		// Check ...
		if (GATE.rsa == '') return GATE.report(0)
		if (GATE.ukey == '') return GATE.report(3)

		var data = {
			app: GATE.app_id,
			version: GATE.app_version,

			login: login,
			passw: passwd,

			ukey: GATE.ukey,
			geo: GATE.geo
		}

		// Criptografando rsa
		data = RSA.encrypt(JSON.stringify(data), RSA.getPublicKey(GATE.rsa))

		// close the glass
		GATE.glass(true)

		// Enviando os dados ...
		GATE.post(GATE.loginUrl, data, (e, res) => {
			GATE.glass(false) // open the glass

			if (e) return GATE.report(4)

			// Checando a sincronização com o servidor (criptografia ok)
			GATE.sync(res, (e, data) => {
				if (e) return GATE.report(4)

				GATE.report(5, 'info')
				return GATE.homePage()
			})
		})
	},

	logout: () => GATE.gate(GATE.controller, GATE.logoutAction, {id: GATE.id}, () => GATE.reset()),

	// Clear local data (logout)
	reset: () => {
		GATE.rsa = ''
		GATE.id = 0
		GATE.ukey = rpass()
		GATE.token = false

		// Save (clear config file)
		GATE.save(() => {
			GATE.loginPage()
			GATE.report(6, 'info')
		})
	},

	// Obtém a chave pública do servidor
	getPublicKey: cb =>
		GATE.get(GATE.keyUrl, (e, key) => {
			var pk = key.replace(/\s|\n|\r|\n\r/g)

			if (pk.length < 50) {
				GATE.rsa = ''
				return cb ? cb(true) : null
			}
			GATE.rsa = pk
			return cb ? cb(GATE.rsa) : null
		}),

	// Gateway to server api
	gate: (controller, action, param, cb) => {
		// Formatting ...
		var dt = {
			error: false,
			app: GATE.app_id,
			version: GATE.app_version,

			id: GATE.id,
			ukey: GATE.ukey,
			token: GATE.token,

			controller: controller,
			action: action,
			param: param
		}

		// Encrypting with AES ...
		var encData = AES.encrypt(JSON.stringify(dt), GATE.ukey)
		encData = GATE.token + encData

		// close the glass
		GATE.glass(true)

		GATE.post(GATE.gateUrl, encData, (e, res) => {
			GATE.glass(false) // open the glass

			if (e) {
				GATE.report(8)
				return cb(true, res)
			}

			// Checking the synchronization with the server (encryption = ok)
			GATE.sync(res, cb)
		})
	},

	// Checking the synchronization ...
	sync: (res, cb) => {
		if ('undefined' != typeof res['error']) {
			GATE.reset()
			return cb(true, res.data)
		}

		var data = false

		// Decrypting ...
		try {
			var dec = AES.decrypt(res, GATE.ukey)
			data = JSON.parse(dec)

			GATE.id = data.id
			GATE.ukey = data.ukey
			GATE.token = data.token

			// Save in Cache Storage
			GATE.save(e => cb(e !== false ? true : false, data))
		} catch (e) {
			GATE.reset()
			return cb(true, e)
		}
	},

	isValidToken: () =>
		GATE.gate(GATE.controller, GATE.chkTokenAction, {}, e => (e ? GATE.loginPage() : GATE.homePage())),
	save: cb => GATE.post(GATE.configUrl, {id: GATE.id, token: GATE.token, ukey: GATE.ukey}, cb),
	load: cb => GATE.get(GATE.configUrl, cb),

	// Send a HTTP GET
	get: (url, cb) => {
		fetch(url, {
			method: 'GET',
			headers: {
				Accept: '*/*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
		})
			.then(response => response.text())
			.then(res => cb(false, res))
			.catch(error => cb(true, error))
	},

	// Send a HTTP POST
	post: (url, data, cb) => {
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				Pragma: 'no-cache',
				'Cache-Control': 'no-cache'
			},
			body: data
		})
			.then(response => response.text())
			.then(res => cb(false, res))
			.catch(error => cb(true, error))
	}
}
