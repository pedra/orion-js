/**
 *	CFG - File Data Persistence
    It uses Cache Storage to retrieve data in navigator
 */

const CFG = {
	file: '/config',
	db: {},

	get: item => CFG.db[item] || false,
	set: (item, value) => {
		CFG.db[item] = value
		return CFG
	},
	clear: cb => {
		CFG.db = {}
		CFG.save(cb)
	},

	// Application cache estore operations
	save: cb =>
		fetch(CFG.file, {method: 'POST', body: JSON.stringify(CFG.db)})
			.then(() => ('function' == typeof cb ? cb(false) : null))
			.catch(e => ('function' == typeof cb ? cb(e) : null)),
	load: cb =>
		fetch(CFG.file)
			.then(response => response.json())
			.then(data => {
				CFG.db = data
				return 'function' == typeof cb ? cb(false, CFG.db) : null
			})
			.catch(e => ('function' == typeof cb ? cb(e) : null))
}
