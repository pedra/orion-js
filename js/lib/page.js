/**
 * PAGE.JS
 */

var PAGE = {
	go: p => {
		if (p == 'login') {
			_('#login').classList.add('on')
			_('#pg_person').classList.remove('on')
			_('#hed_home').classList.remove('on')
			setTimeout(function() {
				_('#audio').play()
			}, 700)

			setTimeout(function() {
				_('#log_login').value = ''
				_('#log_passw').value = ''
			}, 1000)
		}
		if (p == 'home') {
			_('#login').classList.remove('on')

			setTimeout(function() {
				_('#hed_home').classList.add('on')
				_('#pg_person').classList.add('on')
				PERSON.show()
			}, 200)
		}
		return false
	}
}

// var MENU = {
// 	close: e => console.log(e) // implantar para fechar menu lateral
// }

// var XPAGE = {
// 	back: 'headder_back',
// 	title: 'headder_title',
// 	pages: {
// 		login: {
// 			id: 'pg_login',
// 			title: 'Login',
// 			action: ['USER', 'show'],
// 			trail: ['login']
// 		},
// 		home: {
// 			id: 'pg_home',
// 			title: 'Home',
// 			action: ['HOME', 'show', 'hide'],
// 			trail: ['home']
// 		},
// 		registry: {
// 			id: 'pg_registry',
// 			title: 'Cadastro',
// 			action: ['PERSON', 'showForm'],
// 			trail: ['cadastro']
// 		},
// 		transfer: {
// 			id: 'pg_transfer',
// 			title: 'Tranferir',
// 			action: ['PERSON', 'showFormTransfer'],
// 			trail: ['cadastro']
// 		},
// 		person: {
// 			id: 'pg_person',
// 			title: 'Usuários',
// 			action: ['PERSON', 'show', 'hide'],
// 			trail: ['person']
// 		},
// 		account: {
// 			id: 'pg_account',
// 			title: 'Contas',
// 			action: ['ACCOUNT', 'show', 'hide'],
// 			trail: ['account']
// 		},

// 		off: {
// 			id: 'pg_off',
// 			title: '',
// 			action: ['USER', 'show', ''],
// 			trail: ['login']
// 		}
// 	},
// 	page: 'off',
// 	headderBack: null,

// 	init: function() {
// 		history.pushState({p: 0}, '', '/')
// 		history.pushState({p: 'login'}, '', '/')
// 		PAGE.headderBack = _(PAGE.back)

// 		// Reagindo a ação do botão VOLTAR do navegador
// 		window.onpopstate = function(e) {
// 			console.log('POP', history.state, e.state)

// 			if ('undefined' == typeof e.state['p']) {
// 				history.pushState({p: 'login'}, '', '/')
// 				return PAGE.headderBack ? (PAGE.headderBack.style.display = 'none') : true
// 			}
// 			if (e.state.p == 1) {
// 				return PAGE.headderBack ? (PAGE.headderBack.style.display = 'none') : true
// 			}
// 			if (e.state.p == 0) {
// 				history.pushState({p: 'login'}, '', '/')
// 				return PAGE.headderBack ? (PAGE.headderBack.style.display = 'none') : true
// 			}

// 			PAGE.go(e.state.p, true)
// 		}
// 	},

// 	// switch pages in single page
// 	go: function(pg, popstate, data) {
// 		var prev = PAGE.page
// 		var pgs = PAGE.pages

// 		if (pg == prev) return MENU.close('Menu 1')
// 		var p = pgs[pg].id || false
// 		if (!p) return false

// 		_a('.page').forEach(a => a.classList.remove('on')) // hidde all div.page
// 		_(p).classList.add('on') // show page
// 		MENU.close('Menu 2') // fechando menu lateral
// 		PAGE.page = pg

// 		_(PAGE.title).innerHTML = '<h4>' + pgs[pg].title + '</h4>'
// 		PAGE.headderBack ? (PAGE.headderBack.style.display = 'block') : null
// 		if (popstate !== true) history.pushState({p: pg}, '', '/')

// 		// hide "back" icon in login
// 		if (pg == 'login') {
// 			PAGE.headderBack ? (PAGE.headderBack.style.display = 'none') : null
// 			_(PAGE.title).style.left = '23px'
// 		} else {
// 			_(PAGE.title).removeAttribute('style')
// 		}

// 		// Action SHOW
// 		if ('function' == typeof window[pgs[pg].action[0]][pgs[pg].action[1]]) {
// 			window[pgs[pg].action[0]][pgs[pg].action[1]](data)
// 		}

// 		// Action HIDE()
// 		try {
// 			if ('function' == typeof window[pgs[prev].action[0]][pgs[prev].action[2]]) {
// 				window[pgs[prev].action[0]][pgs[prev].action[2]]()
// 			}
// 		} catch (e) {}
// 	}
// }
