/*
    # PAGE

    Change a "page" of the single page application style!


*/

const PAGE = {
	home: () => {
		_('#pg-registry').classList.remove('on')
		_('#pg-home').classList.add('on')
	},
	login: () => {
		_('#pg-home').classList.remove('on')
		_('#pg-registry').classList.add('on')
	}
}
