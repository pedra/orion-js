var PERSON = {
	controller: 'Person.User',
	formForm: '#reg_form',
	formId: '#reg_id',
	formIdAccount: '#reg_idAccount',
	formName: '#reg_name',
	formDoc: '#reg_doc',
	formEmail: '#reg_email',
	formPassw: '#reg_password',
	formType: '#reg_type',
	formLevel: '#reg_level',
	formValue: '#reg_value',
	formCode: '#reg_code',

	traForm: '#tra_form',
	traId: '#tra_id',
	traIdAccount: '#tra_idAccount',
	traIdForm: '#tra_id_from',
	traIdTo: '#tra_id_to',
	traNameForm: '#tra_name_from',
	traNameTo: '#tra_name_to',
	traDoc: '#tra_doc',
	traValueSaldo: '#tra_value_saldo',
	traValue: '#tra_value',
	traCode: '#tra_code',

	persons: [],
	pointer: 0,
	listDiv: '#person_html',
	page: {
		rpp: 5,
		page: 1,
		pages: 0,
		total: 0,
		query: '',
		order: 'id'
	},

	init: () => {
		_('#searchBarQuery').onkeypress = e => {
			PERSON.page.query = e.target.value
			if (e.keyCode == 13) PERSON.show()
		}
		_('#searchBarGo').onclick = () => {
			PERSON.page.query = _('#searchBarQuery').value
			PERSON.show()
		}
		_('#searchBarOrder').onchange = e => {
			PERSON.page.order = e.target.value
			PERSON.show()
		}
		_('#searchBarRpp').onchange = e => {
			PERSON.page.rpp = e.target.value
			PERSON.show()
		}
	},

	resetSearch: () => {
		_('#searchBarQuery').value = ''
		_('#searchBarOrder').value = PERSON.page.order
		_('#searchBarRpp').value = PERSON.page.rpp
	},

	show: () =>
		PERSON.server(
			'Index',
			{query: PERSON.page.query, page: PERSON.page.page, rpp: PERSON.page.rpp, order: PERSON.page.order},
			(e, res) => {
				TMP = res
				if (('undefined' != res['error'] && res.error == true) || null == res['data']) {
					report(_m('person', 0))
					PERSON.persons = []
					PERSON.list()
					return false
				}
				try {
					PERSON.persons = res.data.data
					PERSON.page.rpp = res.data.rpp
					PERSON.page.page = res.data.page
					PERSON.page.pages = res.data.pages
					PERSON.page.total = res.data.total
					PERSON.list()
				} catch (e) {
					console.log('PERSON-error', e, res)
				}
			}
		),

	showForm: () => PERSON.form(0),

	getPage: page => {
		_(PERSON.listDiv).innerHTML = ''
		PERSON.page.page = page
		PERSON.show()
	},

	// calculado para escolher uma das 6 fotos de teste ...
	fotoCalc: n => {
		while (true) {
			if (n < 1 || n < 6) break
			n = n - 6
		}
		return n == 0 ? 6 : n
	},

	list: () => {
		PERSON.resetSearch()
		_(PERSON.listDiv).innerHTML = ''
		PERSON.pointer = 0

		if (PERSON.persons.length > 0) PERSON.listLoop()
		else _(PERSON.listDiv).innerHTML = '<span class="listempty">' + _m('person', 0) + '</span>'
	},

	listLoop: () => {
		var row = PERSON.persons[PERSON.pointer]
		var h = ''

		var type = 'X',
			level = 'X',
			value = parseFloat(row.value).toFixed(2)
		value = value == 'NaN' ? '0.00' : value
		switch (row.type) {
			case 'F':
				type = 'Pessoa'
				break
			case 'J':
				type = 'Empresa'
				break
			case 'B':
				type = 'Banco'
				break
		}
		switch (row.level) {
			case 'C':
				level = 'Cliente'
				break
			case 'A':
				level = 'Administrador'
				break
		}

		var foto = PERSON.fotoCalc(row.id)
		var sp = value.split('.')
		value = parseInt(sp[0]).toLocaleString() + `<span>,${sp[1]}</span>`

		h += `<div class="card on" id="person-card-${row.id}">
					<img src="${URL_AVATAR}/${foto}.jpg">
					<div class="card_content">
						<div class="person_name">${row.name}</div>
						<span>REG.: ${row.doc}</span>
						<span>Conta: ${row.code}</span>
					</div>
					<div class="person_value"><span>$</span>${value}</div>
					
					<ul class="card_menu">
						<li onclick="PERSON.form(${row.id})"><i class="material-icons">edit</i>Editar</li>
						<li onclick="PERSON.transfer(${row.id})"><i class="material-icons">attach_money</i>Colocar Crédito</li>
						<li class="separator"></li>
						<li onclick="PERSON.del(${row.id})"><i class="material-icons">close</i>Deletar</li>
					</ul>
				</div>`
		_(PERSON.listDiv).innerHTML += h

		PERSON.pointer += 1
		if (PERSON.pointer < PERSON.persons.length) {
			PERSON.listLoop()
		} else {
			PERSON.pointer = 0
			PERSON.pagination()
		}

		// Efeito de retardo na listagem
		// setTimeout(function() {
		// 	var e = 0.1
		// 	PERSON.persons.map(a => {
		// 		e += 0.1
		// 		_('#person-card-' + a.id).style.transitionDelay = e.toFixed(1) + 's'
		// 		_('#person-card-' + a.id).classList.add('on')
		// 	})
		// }, 10)
	},

	pagination: () => {
		var h = ''
		var p = PERSON.page

		h += `<div class="pagination"><div>Mostrando ${PERSON.persons.length} de ${p.total} registro${
			p.total.length > 1 ? 's' : ''
		}.</div>`

		// Paginação
		if (p.pages > 1) {
			var onclick = 'PERSON.getPage' // Função a ser chamada no click do botão
			var gama = 2 // número de botões mostrados antes e depois do botão ativo

			var on = p.page == 1 ? 'on' : ''
			h += `<button class="${on}"${p.page == 1 ? '' : ` onclick="${onclick}(1)"`}>1</button>${
				p.page - 2 > gama ? '<span>...</span>' : ''
			}`

			for (var i = p.page - gama; i <= p.page + gama; i++) {
				on = i == p.page ? 'on' : ''
				if (i > 1 && i < p.pages)
					h += `<button class="${on}"${i == p.page ? '' : ` onclick="${onclick}(${i})"`}> ${i} </button>`
			}
			on = p.page == p.pages ? 'on' : ''
			h +=
				(p.pages - p.page - 1 > gama ? '<span>...</span>' : '') +
				`<button class="${on}"${p.pages == p.page ? '' : ` onclick="${onclick}(${p.pages})"`}>${
					p.pages
				}</button>`
		}

		_(PERSON.listDiv).innerHTML += '</div>' + h
	},

	resetForm: () => {
		_(PERSON.formId).value = 0
		_(PERSON.formIdAccount).value = 0
		_(PERSON.formName).value = ''
		_(PERSON.formDoc).value = ''
		_(PERSON.formEmail).value = ''
		_(PERSON.formPassw).value = ''
		_(PERSON.formType).value = 'F'
		_(PERSON.formLevel).value = 'C'
		_(PERSON.formValue).value = 0
		_(PERSON.formCode).value = 0
	},

	save: () => {
		var id = _(PERSON.formId).value
		var account = _(PERSON.formIdAccount).value
		var name = _(PERSON.formName).value
		var doc = _(PERSON.formDoc).value
		var email = _(PERSON.formEmail).value
		var passw = _(PERSON.formPassw).value
		var type = _(PERSON.formType).value
		var level = _(PERSON.formLevel).value
		var value = _(PERSON.formValue).value
		var code = _(PERSON.formCode).value

		if (name == '' || doc == '' || email == '' || passw == '') return report(_m('person', 1))

		PERSON.server('Save', {id, account, name, doc, email, passw, type, level, value, code}, (e, res) => {
			if (e == false) {
				var derror = true
				try {
					derror = JSON.parse(res.data).error
				} catch (er) {}
				report(derror ? _m('person', 7) : _m('person', 6), derror ? ALERT : INFO)
			} else {
				report(_m('person', 7))
			}
			PERSON.resetForm()
			PAGE.go('person')
		})
	},

	saveTranf: () => {
		var id = _(PERSON.traId).value
		var account = _(PERSON.traIdAccount).value
		var code = _(PERSON.traCode).value
		var traIdForm = _(PERSON.traIdForm).value
		var traIdTo = _(PERSON.traIdTo).value
		var value = _(PERSON.traValue).value
		var valueTotal = _(PERSON.traValueSaldo).value
		console.log(code)
		if (value == '') return report(_m('person', 1))

		PERSON.server('SaveTranf', {id, account, code, traIdForm, traIdTo, value, valueTotal}, (e, res) => {
			if (e == false) {
				var derror = true
				try {
					derror = JSON.parse(res.data).error
				} catch (er) {}
				report(derror ? _m('person', 7) : _m('person', 6), derror ? ALERT : INFO)
			} else {
				report(_m('person', 7))
			}
			PERSON.resetForm()
			PAGE.go('person')
		})
	},

	form: id => {
		PERSON.resetForm()
		PAGE.go('registry')
		if ('number' != typeof id || id == 0) return true

		PERSON.server('GetById', {id}, (e, res) => {
			var data = JSON.parse(res.data)
			console.log('EDIT: ', data)
			try {
				_(PERSON.formId).value = data.id
				_(PERSON.formIdAccount).value = data.account
				_(PERSON.formName).value = data.name
				_(PERSON.formDoc).value = data.doc
				_(PERSON.formEmail).value = data.login
				_(PERSON.formPassw).value = data.passw
				_(PERSON.formType).value = data.type
				_(PERSON.formLevel).value = data.level
				_(PERSON.formValue).value = data.value
				_(PERSON.formCode).value = data.code
			} catch (e) {
				report(_m('person', 11))
				return PAGE.go('person')
			}
		})
	},

	showFormTransfer: () => PERSON.transfer(0),

	transfer: id => {
		PERSON.resetForm()
		PAGE.go('transfer')
		if ('number' != typeof id || id == 0) return true

		PERSON.server('GetById', {id}, (e, res) => {
			var data = JSON.parse(res.data)
			try {
				_(PERSON.traId).value = data.id
				_(PERSON.traIdForm).value = USER.id
				_(PERSON.traIdTo).value = data.id
				_(PERSON.traNameForm).value = USER.name
				_(PERSON.traIdAccount).value = data.account
				_(PERSON.traNameTo).value = data.name
				_(PERSON.traDoc).value = data.doc
				_(PERSON.traCode).value = data.code
				_(PERSON.traValueSaldo).value = data.value
				_(PERSON.traValue).value = 0
			} catch (e) {
				report(_m('person', 11))
				return PAGE.go('person')
			}
		})
	},

	del: id => {
		return report('Função não implementada!')
		PERSON.server('Delete', {id}, e => (!e ? report(_m('person', 8), WARN) : report(_m('person', 9))))
	},

	server: (action, param, cb) => {
		ME.gate(PERSON.controller, action, param, (e, res) => {
			console.log('[PERSON]', e, res)
			return cb(e, res)
		})
	}
}
