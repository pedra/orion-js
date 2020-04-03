[![Netlify Status](https://api.netlify.com/api/v1/badges/26b88e55-8556-4d7c-8e19-1017b19c8d7a/deploy-status)](https://app.netlify.com/sites/orion-sample/deploys)

# Orion-JS

Client-side to Orion Project

<sub>![logo](https://github.com/fdutrar/orion-node/blob/master/public/icon/favicon-16x16.png)</sub> https://orion-js.netlify.com

To save persistence data to a file in the application's cache, it is **necessary** to install ServiceWorker (`/dist/sw.js`). Understand how this **SW** works by observing it on the way: `/src/sw`

# Build

**This script requires Babel & Gulp 4 or later**

Before using, install the latest version of GULP-CLI and the necessary plugins:

`npm i --save-dev @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/register gulp@4 gulp-concat gulp-if gulp-babel gulp-javascript-obfuscator gulp-uglify uglify-es yargs`

Add these lines to your package.js

`"babel": { "presets": [ "@babel/preset-env"] },`

Using:

`gulp [-pob]`

Options:

**-p** = production mode (minified)

**-o** = obfuscated scripts

**-b** = use Babel (for oldies navigators)

Both script and the service worker file will be mounted in the "/dist" directory

## Crypto

Load the script into your "index.html" using the appropriate tag:

`<script src="/dist/gate.js"></script>`

### To encrypt with RSA:

`var publicKey = "MIIBIjANBgkqhkiG9w0B ... your rsa public key`

`var data = {foo: "foo", bar: "bar"}`

`var rsaBase64String = RSA.encrypt(JSON.stringify(data)), RSA.getPublicKey(publicKey))`

### To encrypt and decrypt with AES:

`var encrypted = AES.encrypt("Hello World!", "senha123")`

`var decrypted = AES.decrypt(encrypted, "senha123")`

---

By Bill Rocha <https://billrocha.netlify.com>
