/*  
    By Bill Rocha <prbr@ymail.com>

    *** Este script requer o Babel & Gulp 4 ou posterior *** 
    Antes de usar, instale a última versão do GULP-CLI e os plugins necessários:

    npm i --save-dev @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/register
    npm i --save-dev gulp@4 gulp-autoprefixer gulp-clean-css gulp-concat gulp-html-minifier2 gulp-if gulp-watch gulp-babel
    npm i --save-dev gulp-javascript-obfuscator gulp-sass gulp-uglify streamqueue uglify-es del yargs

    adicione essas linhas no seu package.js

    "babel": {
        "presets": [ "@babel/preset-env"]
    },

 */

'use strict'

import {exec, spawn} from 'child_process'
import {gulp, series, parallel, src, dest} from 'gulp'
import babel from 'gulp-babel'
import gulpif from 'gulp-if'
import minifyCSS from 'gulp-clean-css'
import htmlmin from 'gulp-html-minifier2'
import concat from 'gulp-concat'
import yargs from 'yargs'
import streamqueue from 'streamqueue'
import javascriptObfuscator from 'gulp-javascript-obfuscator'
import uglifyes from 'uglify-es'
import composer from 'gulp-uglify/composer'
//import watch from 'gulp-watch'
import path from 'path'
import del from 'del'
import {createBrotliCompress} from 'zlib'

const uglify = composer(uglifyes, console)
const argv = yargs.argv

// CONFIGURATION -------------------------------------------------------------- [CONFIG]
const DESTINATION = './../SALVA/WWW'

// Chaveando DEV/PRO/COPY
let DEV = argv.p === undefined ? true : false // gulp -p
let COPY = (argv.c || false) && !DEV ? path.resolve('string' == typeof argv.c ? argv.c : DESTINATION) : false // gulp -pc [./../path_to_production]
let SYNC = argv.s !== undefined // gulp -s == run ./sync.bat -p

// Deixando as coisas bem claras ...
console.log(
	'\n---------------------------------------------------\n    ' +
		(DEV ? "DEVELOPMENT mode ['gulp -p' to production]" : 'PRODUCTION mode') +
		'\n---------------------------------------------------\n'
)

// STYLES (CSS & more) ---------------------------------------------------- [CSS]
const style = () =>
	streamqueue(
		{objectMode: true},
		//src(['src/sass/**/*.scss']).pipe(sass()),
		src([
			'css/common.css',
			'css/theme.css',
			'css/card.css',
			'css/site.css',
			'css/login.css',
			'css/header.css',
			'css/main.css'
		])
	)
		.pipe(concat('style.css'))
		.pipe(gulpif(!DEV, minifyCSS({level: {1: {specialComments: 0}}})))
		.pipe(dest('css'))

// Comprimindo e juntando os arquivos JS ---------------------------------- [JS]
const vendor = () =>
	src(['js/vendor/jsbn.js', 'js/vendor/pbkdf2.js', 'js/vendor/rsa.js', 'js/vendor/aes.js', 'js/vendor/aes_main.js'])
		.pipe(concat('v.js'))
		.pipe(gulpif(!DEV, uglify()))
		.pipe(dest('js'))

const lib = () =>
	src(['js/lib/helpers.js', 'js/lib/cfg.js', 'js/lib/page.js', 'js/lib/me.js'])
		//.pipe(babel())
		.pipe(concat('l.js'))
		.pipe(gulpif(!DEV, uglify()))
		.pipe(gulpif(!DEV, javascriptObfuscator({compact: true, sourceMap: false})))
		.pipe(dest('js'))

const app = () =>
	src(['js/app/speech.js', 'js/app/person.js', 'js/app/account.js', 'js/app/home.js', 'js/app/main.js'])
		//.pipe(babel())
		.pipe(concat('a.js'))
		.pipe(gulpif(!DEV, uglify()))
		.pipe(gulpif(!DEV, javascriptObfuscator({compact: true, sourceMap: false})))
		.pipe(dest('js'))

const sw = () => {
	let source = !DEV ? ['js/sw/file_prod.js', 'js/sw/sw.js'] : ['js/sw/file.js', 'js/sw/sw.js']
	return (
		src(source)
			//.pipe(babel())
			.pipe(concat('sw.js'))
			.pipe(gulpif(!DEV, uglify()))
			.pipe(gulpif(!DEV, javascriptObfuscator({compact: true, sourceMap: false})))
			.pipe(dest('./'))
	)
}

const script = () =>
	src(['js/v.js', 'js/l.js', 'js/a.js'])
		.pipe(concat('script.js'))
		.pipe(dest('js'))
const script_cleanner = cb => {
	del.sync(['js/v.js', 'js/l.js', 'js/a.js'], {force: true})
	return cb()
}

// Lang ------------------------------------------------------------------- [LANG]
const lang = () =>
	src(['js/lang/**/*'])
		.pipe(uglify())
		//.pipe(javascriptObfuscator({compact: true, sourceMap: false}))
		.pipe(dest('lang'))

// Html ------------------------------------------------------------------- [HTML]
const html = () => {
	if (!DEV) {
		return src(['html/header_prod.html', 'html/login.html', 'html/home.html', 'html/footer_prod.html'])
			.pipe(concat('index.html'))
			.pipe(
				htmlmin({
					collapseWhitespace: true,
					removeComments: true,
					//removeRedundantAttributes: true,
					removeEmptyAttributes: true
				})
			)
			.pipe(dest('./'))
	} else {
		return src(['html/header.html', 'html/login.html', 'html/home.html', 'html/footer.html'])
			.pipe(concat('index.html'))
			.pipe(dest('./'))
	}
}

// TASKs ----------------------------------------------------------- [TASKs]
exports.default = series(parallel(style, lib, vendor, app, lang, html, sw), script, script_cleanner) // Run: gulp [-p]
exports.html = html // Run: gulp html [-p]
exports.app = series(parallel(app), script, script_cleanner) // Run: gulp app [-p]
exports.lib = series(parallel(lib), script, script_cleanner) // Run: gulp lib [-p]
exports.lang = lang // Run: gulp lang
exports.sw = sw // Run: gulp sw [-p]
exports.css = style // Run: gulp style [-p]
exports.script = series(script, script_cleanner) // Run: gulp script [-p]
exports.js = series(parallel(lib, vendor, app, sw), script, script_cleanner) // Run: gulp js [-p]
