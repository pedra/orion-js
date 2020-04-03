"use strict";

// CACHE ----------------------------------------------------------------------------
var VERSION = '2003182214';
var FILES = ['/', // Opcional manifest files ------
// '/icon/site.json',
// '/icon/favicon.ico',
// '/favicon.ico',
// '/icon/favicon-16x16.png',
// '/icon/favicon-32x32.png',
// '/icon/android-chrome-192x192.png',
// '/icon/android-chrome-512x512.png',
// '/icon/apple-touch-icon.png',
// '/icon/safari-pinned-tab.svg',
'js/vendor/rsa.js', 'js/vendor/aes.js', '/js/gate.js'];
"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var CACHE = 'APP_' + VERSION;
var OFFLINE = 'OFFLINE_' + VERSION;
var DATAFILE = '/config'; // INSTALL  -------------------------------------------------------------------------

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    // console.log('[SWORKER caching "' + CACHE + '"]')
    cache.addAll(FILES);
  }).then(function () {
    return self.skipWaiting();
  }));
}); // ACTIVATE -------------------------------------------------------------------------

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ks) {
      var _iterator, _step, k;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iterator = _createForOfIteratorHelper(ks);
              _context.prev = 1;

              _iterator.s();

            case 3:
              if ((_step = _iterator.n()).done) {
                _context.next = 10;
                break;
              }

              k = _step.value;

              if (!(k !== CACHE)) {
                _context.next = 8;
                break;
              }

              _context.next = 8;
              return caches["delete"](k);

            case 8:
              _context.next = 3;
              break;

            case 10:
              _context.next = 15;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](1);

              _iterator.e(_context.t0);

            case 15:
              _context.prev = 15;

              _iterator.f();

              return _context.finish(15);

            case 18:
              self.clients.claim();

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 12, 15, 18]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()));
}); // FETCH   --------------------------------------------------------------------------

self.addEventListener('fetch', function (event) {
  var request = event.request,
      _event$request = event.request,
      url = _event$request.url,
      method = _event$request.method; // Saves || loads json data to Cache Storage (fake file)

  if (url.match(DATAFILE)) {
    if (method === 'POST') {
      request.json().then(function (body) {
        return caches.open(CACHE).then(function (cache) {
          return cache.put(DATAFILE, new Response(JSON.stringify(body)));
        });
      });
      return event.respondWith(new Response('{}'));
    } else {
      return event.respondWith(caches.match(DATAFILE).then(function (response) {
        return response || new Response('{}');
      }));
    }
  } else {
    // Get & save request in Cache Storage
    if (method !== 'POST') {
      event.respondWith(caches.open(CACHE).then(function (cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function (response) {
            // Saves the requested file to CACHE (uncomment next line)
            // cache.put(event.request, response.clone())
            return response;
          });
        });
      }));
    } else return;
  }
});