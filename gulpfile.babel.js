/*  
    By Bill Rocha <https://billrocha.netlify.com>

	*** This script requires Babel & Gulp 4 or later *** 
    Before using, install the latest version of GULP-CLI and the necessary plugins:

    npm i --save-dev @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/register gulp@4 gulp-concat gulp-if gulp-babel gulp-javascript-obfuscator gulp-uglify uglify-es yargs

    Add these lines to your package.js

    "babel": {
        "presets": [ "@babel/preset-env"]
	},
	

	Using:

	gulp [-pob]

	Options:
	-p = production mode (minified)	
	-o = obfuscated scripts	
	-b = use Babel (for oldies navigators)

	Both script and the service worker file will be mounted in the "/dist" directory

 */

'use strict'

import {gulp, series, parallel, src, dest} from 'gulp'
import babel from 'gulp-babel'
import gulpif from 'gulp-if'
import concat from 'gulp-concat'
import yargs from 'yargs'
import javascriptObfuscator from 'gulp-javascript-obfuscator'
import uglifyes from 'uglify-es'
import composer from 'gulp-uglify/composer'

const uglify = composer(uglifyes, console)
const argv = yargs.argv

// CONFIGURATION -------------------------------------------------------------- [CONFIG]

// args
let PRO = argv.p !== undefined // gulp -p (production mode)
let OBF = (argv.o || false) && PRO // gulp -o (obfuscator)
let BABEL = argv.b !== undefined // gulp -b (to run Babel)

// show config
console.log(
	'\n---------------------------------------------------\n    ' +
		(!PRO ? "DEVELOPMENT mode ['gulp -p' to production]" : 'PRODUCTION mode') +
		'\n---------------------------------------------------\n'
)

const vendor_aes = () =>
	src(['src/vendor/source/aes.js', 'src/vendor/source/pbkdf2.js', 'src/vendor/source/aesman.js'])
		.pipe(concat('aes.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(dest('src/vendor'))

const vendor_rsa = () =>
	src(['src/vendor/source/jsbn.js', 'src/vendor/source/rsa.js'])
		.pipe(concat('rsa.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(dest('src/vendor'))

const lib = () =>
	src(['src/vendor/aes.js', 'src/vendor/rsa.js', 'src/gate.js'])
		.pipe(gulpif(BABEL, babel()))
		.pipe(gulpif(PRO, concat('script.js'), concat('script.dev.js')))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({compact: true, sourceMap: false})))
		.pipe(dest('dist'))

const sw = () => {
	let source = PRO ? ['src/sw/file_pro.js', 'src/sw/sw.js'] : ['src/sw/file.js', 'src/sw/sw.js']
	return src(source)
		.pipe(gulpif(BABEL, babel()))
		.pipe(gulpif(PRO, concat('sw.js'), concat('sw.dev.js')))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({compact: true, sourceMap: false})))
		.pipe(dest('dist'))
}

// TASKs ----------------------------------------------------------- [TASKs]
exports.default = series(parallel(vendor_aes, vendor_rsa, sw), lib) // gulp [-pob]
exports.aes = vendor_aes // gulp aes [-pob]
exports.rsa = vendor_rsa // gulp rsa [-pob]
exports.lib = series(parallel(vendor_aes, vendor_rsa), lib) // gulp lib [-pob]
exports.sw = sw // gulp sw [-pob]
