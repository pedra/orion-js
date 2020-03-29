var ACCOUNT = {
	controller: 'Bank.Account',
	accounts: [],

	init: () => null, //_('#btn_add').onclick = () => ACCOUNT.add(),
	show: () => ACCOUNT.server('Index', {id: 0}, e => null),

	list: () => {
		var div = _('#list_account')
		var h = '<span>' + _m('account', 0) + '</span>'

		if (ACCOUNT.accounts.length > 0) {
			h = `<table>
                <tr>
                    <th>Id</th>
                    <th>Person Id</th>
                    <th>Conta</th>
                    <th style="text-align: center">Valor</th>
                </tr>`

			ACCOUNT.accounts.map(row => {
				h += `<tr id="accounts_${row.id}">
                    <td>${row.id}</td>
                    <td>${row.person}</td>
                    <td>${row.code}</td>
                    <td align="right">${row.value}</td>
                </tr>`
			})

			h += '</table>'
		}

		div.innerHTML = h
	},

	add: () => {
		return report('Função não implementada!')
		var name = _('#add_name').value
		if (!name || name == '') return report(_m('account', 1))
		_('#add_name').value = ''

		ACCOUNT.server('Add', {name}, e => (!e ? report(_m('account', 2), INFO) : report(_m('account', 4))))
	},

	edit: id => {
		return report('Função não implementada!')
		var name = _('#name_' + id).value

		if ('undefined' == typeof name || name == '') {
			_('#name_' + id).focus()
			return report(_m('account', 5))
		}

		ACCOUNT.server('Update', {id, name}, e => (!e ? report(_m('account', 6), INFO) : report(_m('account', 7))))
	},

	del: id => {
		return report('Função não implementada!')
		ACCOUNT.server('Delete', {id}, e => (!e ? report(_m('account', 8), WARN) : report(_m('account', 9))))
	},

	server: (action, param, cb) => {
		ME.gate(ACCOUNT.controller, action, param, (e, res) => {
			if (!e && undefined != typeof res['data']) {
				var tmp = JSON.parse(res.data)

				if (undefined != typeof tmp['data']) {
					ACCOUNT.accounts = tmp.data
					ACCOUNT.list()
				}
				return cb(e, tmp)
			}
			return cb(e, res)
		})
	}
}
