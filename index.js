'use strict'

var util = require('util')

var Observable = require('rxjs/Observable').Observable
var Subscription = require('rxjs/Subscription').Subscription

module.exports = StaticObservable

/**
 * @class StaticObservable
 */
function StaticObservable () {
  Observable.call(this, subscribe)
  var self = this
  this._observer = null
  this._observerCalls = []
  function subscribe (observer) {
    self._observer = observer
    while (self._observerCalls.length) {
      var call = self._observerCalls.shift()
      observer[call.method].apply(observer, call.args)
    }
    return new Subscription()
  }
}

// inherit from observable
util.inherits(StaticObservable, Observable)

/**
 * StaticObservable factories
 */

/**
 * returns an Observable that is immediately "nexted" w/ the given "next" value (all args)
 * @param  {*} next  observable next value
 * @return {Observable} observable
 */
StaticObservable.next = function () {
  var observable = new StaticObservable()
  return observable.next.apply(observable, arguments)
}

/**
 * returns an Observable that is immediately "errored" w/ the given error (all args)
 * @param  {Error} error  observable error
 * @return {Observable} observable
 */
StaticObservable.error = function () {
  var observable = new StaticObservable()
  return observable.error.apply(observable, arguments)
}

/**
 * returns an Observable that is immediately "completed"
 * @return {Observable} observable
 */
StaticObservable.complete = function () {
  var observable = new StaticObservable()
  return observable.complete.apply(observable, arguments)
}

/**
 * Chainable instance methods
 */

StaticObservable.prototype.next = observerCall('next')

StaticObservable.prototype.error = observerCall('error')

StaticObservable.prototype.complete = observerCall('complete')

function observerCall (method) {
  return function () {
    var _observer = this._observer
    if (_observer) {
      _observer[method].apply(_observer, arguments)
    } else {
      this._observerCalls.push({
        method: method,
        args: Array.prototype.slice.call(arguments)
      })
    }
    return this
  }
}