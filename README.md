# static-observable  [![Build Status](https://travis-ci.org/tjmehta/static-observable.svg?branch=master)](https://travis-ci.org/tjmehta/static-observable) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
Static observable methods `next`, `error`, and `complete`. Equivalent to `Promise.resolve()` and `Promise.reject()` for promises.

# Installation
```bash
npm i --save static-observable
npm i --save rxjs # peer dependency
```

# Why?
For quick return cases and test stubs

# Usage
Example: chain
```js
var StaticObservable = require('static-observable')

var observable = StaticObservable
  .next({ foo: 1 })
  .next({ foo: 2 })
  .complete()

observable.subscribe(
  function (next) { console.log('NEXT:', next )},
  function (err) { console.log('ERROR:', err )},
  function () { console.log('COMPLETE' )}
)
// NEXT: { foo: 1 }
// NEXT: { foo: 2 }
// COMPLETE
```

Example: error chain
```js
var StaticObservable = require('static-observable')

var observable = StaticObservable
  .next({ foo: 1 })
  .next({ foo: 2 })
  .error(new Error('boom'))

observable.subscribe(
  function (next) { console.log('NEXT:', next )},
  function (err) { console.log('ERROR:', err )},
  function () { console.log('COMPLETE' )}
)
// NEXT: { foo: 1 }
// NEXT: { foo: 2 }
// ERROR: [Error: boom]
```

Example: error and complete are "safe"
```js
var StaticObservable = require('static-observable')

var observable = StaticObservable
  .error(new Error('boom'))
  .next({ foo: 1 })

observable.subscribe(
  function (next) { console.log('NEXT:', next )},
  function (err) { console.log('ERROR:', err )},
  function () { console.log('COMPLETE' )}
)
// ERROR: [Error: boom]

var observable = StaticObservable
  .complete(new Error('boom'))
  .next({ foo: 1 })

observable.subscribe(
  function (next) { console.log('NEXT:', next )},
  function (err) { console.log('ERROR:', err )},
  function () { console.log('COMPLETE' )}
)
// COMPLETE
```

# License
MIT
