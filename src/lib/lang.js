const LANG = {
	node: [],
	path: '/src/lib/lang/',
	lang: 'pt_BR',

	load: lang => {
		LANG.lang = lang || LANG.lang
		GATE.get(LANG.path + LANG.lang + '.json', (e, d) => {
			if (e !== false) return false
			var data = JSON.parse(d) || false
			if (data == false) return false
			LANG.node[data.node] = data.text
			console.log(e, data)
		})
	},
	get: (node, id) => LANG.node[node][id] || ''
}
