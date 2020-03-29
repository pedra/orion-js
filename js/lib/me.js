/**
 *	ME - represents a ME conected this in system
 */

const ME = {
	formLoginId: '#log_login',
	formForm: '#log_form',
	formPasswordId: '#log_passw',
	headerLogout: '#headder_logout',
	formContainer: '#log_divlogin',

	pageLogin: '',
	pageMain: '',

	name: '',
	id: 0,
	rsa: '',
	token: '',
	ukey: '',
	geo: '',

	init: (pageMain, pageLogin) => {
		ME.pageMain = pageMain
		ME.pageLogin = pageLogin

		_(ME.formForm).onsubmit = e => {
			e.preventDefault()
			ME.login()
		}

		// Pegando a GEOLOCALIZAÇÃO
		ME.getGeolocation()

		// Carregando configuração do Cache Storage
		CFG.load((e, data) => {
			if (e !== false) {
				ME.ukey = rpass() // Gerando a chave local para AES
				return PAGE.go(ME.pageLogin)
			}

			ME.id = data.id
			ME.name = data.name
			ME.ukey = data.ukey
			ME.token = data.token

			return ME.isValidToken()
		})
	},

	show: () => (_(ME.headerLogout).innerHTML = 'lock_open'),

	social: target => null,
	login: () => ME.getPublicKey(false, rsa => ME.log()),
	log: () => {
		// Checando se o formulário e o SERVER estão prontos
		if (ME.checkform() !== false) return false

		// Gerando o objeto a ser enviado
		var data = {
			app: APP_ID,
			version: APP_VERSION,

			login: _(ME.formLoginId).value.trim(),
			passw: _(ME.formPasswordId).value.trim(),

			ukey: ME.ukey,
			geo: ME.geo
		}

		// Criptografando rsa
		data = RSA.encrypt(JSON.stringify(data), RSA.getPublicKey(ME.rsa))

		// Fechando o vidro
		glass(true)

		// Enviando os dados ...
		ME.post(API_URL_LOGIN, data, (e, res) => {
			glass(false)

			if (e) return report(_m('me', 4))

			// Checando a sincronização com o servidor (criptografia ok)
			ME.checkSync(res, (e, data) => {
				if (e) return report(_m('me', 4))

				report(_m('me', 5), INFO)

				//_(ME.headerLogout).innerHTML = 'lock'
				return PAGE.go(ME.pageMain)
			})
		})
	},

	logout: () => {
		/*
			TODO: fazer logout no servidor
					Enviar: ME.gate('logout', "", () => {
									ME.reset() // Sucesso ...
								}, () => {
									ME.reset() // ou Não ...
							})
		 */

		ME.reset() // Apagando os dados locais
		ME.id = 0
		ME.name = ''
		_(ME.headerLogout).innerHTML = 'lock_open'
		PAGE.go(ME.pageLogin) // Voltando para a página de login

		// Avisando ao usuário
		//report(_m('me', 6), INFO)
	},

	checkform: () => {
		if (ME.rsa == '') return report(_m('me', 0))
		if (_(ME.formLoginId).value.trim() == '') return report(_m('me', 1))
		if (_(ME.formPasswordId).value.trim() == '') return report(_m('me', 2))
		if (ME.ukey == '') return report(_m('me', 3))

		return false
	},

	// Reseta as variáveis do Servidor (logout?!)
	reset: () => {
		CFG.clear()

		if (ME.rsa == '') {
			ME.getPublicKey()
		}

		ME.getGeolocation()
		ME.ukey = rpass()
		ME.token = false
	},

	// Get Geo
	getGeolocation: () =>
		// Pegando a GEOLOCALIZAÇÃO
		navigator.geolocation.getCurrentPosition(a => (ME.geo = a.coords.latitude + '|' + a.coords.longitude)),

	// Obtém a chave pública do servidor
	getPublicKey: (force, cb) => {
		if (force !== true && ME.rsa !== '' && ME.rsa.length > 50) {
			return cb ? cb(ME.rsa) : null
		}

		ME.get(API_URL_KEY, (e, key) => {
			var pk = key.replace(/\s|\n|\r|\n\r/g)

			if (pk.length < 50) {
				report(_m('me', 0))
				ME.rsa = ''
			}
			ME.rsa = pk
			return cb ? cb(ME.rsa) : null
		})
	},

	// Chama Action da API
	gate: (controller, action, param, cb) => {
		// Adicionando os dados globais
		var dt = {
			error: false,
			app: APP_ID,
			version: APP_VERSION,

			ukey: ME.ukey,
			geo: ME.geo,
			token: ME.token,

			controller: controller,
			action: action,
			param: param
		}

		// Criptografando com AES ...
		var encData = encrypt(JSON.stringify(dt), ME.ukey)
		encData = ME.token + encData

		// Fechando o vidro
		glass(true)

		ME.post(API_URL_GATE, encData, (e, res) => {
			glass(false)

			if (e) {
				//report(_m("me", 1))
				return cb(true, res)
			}

			// Checando a sincronização com o servidor (criptografia ok)
			ME.checkSync(res, cb)
		})
	},

	// Resolve ...
	checkSync: (res, cb) => {
		if ('undefined' != typeof res['error']) {
			ME.reset()
			PAGE.go(ME.pageLogin)
			return cb(true, res.data)
		}

		var data = false

		// Decriptando ...
		try {
			var dec = decrypt(res, ME.ukey)
			data = JSON.parse(dec)

			// Se vier um "ukey", atualiza o ukey
			if ('undefined' != typeof data['ukey']) {
				ME.ukey = data.ukey
			}

			// Se vier um "token", atualiza o token
			if ('undefined' != typeof data['token']) {
				ME.token = data.token
			}

			// Atualiza o ME.id
			if ('undefined' != typeof data['id']) {
				ME.id = data.id
			}
			// Atualiza o ME.name
			if ('undefined' != typeof data['name']) {
				ME.name = data.name
			}

			// Save in Cache Storage
			CFG.set('ukey', ME.ukey)
				.set('token', ME.token)
				.set('id', ME.id)
				.set('name', ME.name)
				.save(e => cb(e !== false ? true : false, data))
		} catch (e) {
			ME.reset()
			PAGE.go(ME.pageLogin)
			return cb(true, e)
		}
	},

	isValidToken: () => {
		ME.gate('Gate', 'CheckToken', {}, e => PAGE.go(e ? ME.pageLogin : ME.pageMain))
	},

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
