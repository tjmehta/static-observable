'use strict'

var beforeEach = global.beforeEach
var describe = global.describe
var it = global.it

var exists = require('101/exists')
var expect = require('chai').expect

var StaticObservable = require('../index.js')

var expectNotCalled = function (name, done) {
  return function (err) {
    if (name === 'onError') {
      return done(err)
    }
    done(new Error('expect "' + name + '" function is not called'))
  }
}
var recordCall = function (name, calls, cb) {
  return function () {
    calls.push({
      method: name,
      args: Array.prototype.slice.call(arguments)
        .filter(exists) // onComplete is passing an undefined arg?
    })
    if (cb) { cb() }
  }
}

describe('static-observable', function () {
  describe('next', function () {
    it('should create a static observable that immediately nexts', function (done) {
      var next = { foo: 1 }
      var observable = StaticObservable.next(next)
      observable.subscribe(
        function (_next) {
          expect(_next).to.equal(next)
          done()
        },
        expectNotCalled('onError', done),
        expectNotCalled('onCompleted', done)
      )
    })

    it('should chain', function (done) {
      var values = [{}, {}]
      var observable = StaticObservable
        .next(values[0])
        .next(values[1])
        .complete()
      var calls = []
      observable.subscribe(
        recordCall('onNext', calls),
        expectNotCalled('onError', done),
        recordCall('onCompleted', calls, finish)
      )
      function finish () {
        expect(calls).to.deep.equal([
          { method: 'onNext', args: values.slice(0, 1) },
          { method: 'onNext', args: values.slice(1, 2) },
          { method: 'onCompleted', args: [] }
        ])
        done()
      }
    })

    it('should work after subscribe', function (done) {
      var values = [{}, {}]
      var observable = StaticObservable.next(values[0])
      var calls = []
      observable.subscribe(
        recordCall('onNext', calls),
        expectNotCalled('onError', done),
        recordCall('onCompleted', calls, finish)
      )
      // after subscribe: covers next AND complete!
      observable
        .next(values[1])
        .complete()
      function finish () {
        expect(calls).to.deep.equal([
          { method: 'onNext', args: values.slice(0, 1) },
          { method: 'onNext', args: values.slice(1, 2) },
          { method: 'onCompleted', args: [] }
        ])
        done()
      }
    })
  })

  describe('error', function () {
    it('should create a static observable that immediately errors', function (done) {
      var err = new Error('boom')
      var observable = StaticObservable.error(err)
      observable.subscribe(
        expectNotCalled('onNext', done),
        function (_err) {
          expect(_err).to.equal(err)
          done()
        },
        expectNotCalled('onCompleted', done)
      )
    })

    it('should not ignore any calls after', function (done) {
      var values = [{}, {}]
      var observable = StaticObservable
        .complete()
        .next(values[0])
        .next(values[1])
      var calls = []
      observable.subscribe(
        expectNotCalled('onNext', done),
        expectNotCalled('onError', done),
        recordCall('onCompleted', calls, finish)
      )
      function finish () {
        expect(calls).to.deep.equal([
          { method: 'onCompleted', args: [] }
        ])
        done()
      }
    })

    it('should work after subscribe', function (done) {
      var next = {}
      var err = new Error()
      var observable = StaticObservable.next(next)
      var calls = []
      observable.subscribe(
        recordCall('onNext', calls),
        recordCall('onError', calls, finish),
        expectNotCalled('onCompleted', done)
      )
      // after subscribe
      observable.error(err)
      function finish () {
        expect(calls).to.deep.equal([
          { method: 'onNext', args: [next] },
          { method: 'onError', args: [err] },
        ])
        done()
      }
    })
  })

  describe('complete', function() {
    it('should create a static observable that immediately completes', function (done) {
      var err = new Error('boom')
      var observable = StaticObservable.error(err)
      observable.subscribe(
        expectNotCalled('onNext', done),
        function (_err) {
          expect(_err).to.equal(err)
          done()
        },
        expectNotCalled('onCompleted', done)
      )
    })

    it('should not ignore any calls after', function (done) {
      var err = new Error('boom')
      var values = [{}, {}]
      var observable = StaticObservable
        .error(err)
        .next(values[0])
        .next(values[1])
      var calls = []
      observable.subscribe(
        expectNotCalled('onNext', done),
        recordCall('onError', calls, finish),
        expectNotCalled('onCompleted', done)
      )
      function finish () {
        expect(calls).to.deep.equal([
          { method: 'onError', args: [err] }
        ])
        done()
      }
    })
  })
})