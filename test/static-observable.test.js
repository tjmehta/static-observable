var StaticObservable = require('../index.js')

describe('static-observable', () => {
  describe('next', () => {
    it('should create a static observable that immediately nexts', done => {
      var next = { foo: 1 }
      var observable = StaticObservable.next(next)
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      setTimeout(() => {
        expect(onNext).toHaveBeenCalledWith(next)
        expect(onError).not.toHaveBeenCalled()
        expect(onComplete).not.toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should chain', done => {
      var values = [{ foo: 1 }, { foo: 2 }]
      var observable = StaticObservable.next(values[0])
        .next(values[1])
        .complete()
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      setTimeout(() => {
        expect(onNext).toHaveBeenNthCalledWith(1, values[0])
        expect(onNext).toHaveBeenNthCalledWith(2, values[1])
        expect(onError).not.toBeCalled()
        expect(onComplete).toBeCalled()
        expect(
          onNext.mock.invocationCallOrder.concat(
            onComplete.mock.invocationCallOrder
          )
        ).toMatchInlineSnapshot(`
          Array [
            2,
            3,
            4,
          ]
        `)
        done()
      }, 0)
    })

    it('should work after subscribe', done => {
      var values = [{}, {}]
      var observable = StaticObservable.next(values[0])
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      // after subscribe: covers next AND complete!
      observable.next(values[1]).complete()
      setTimeout(() => {
        expect(onNext).toHaveBeenNthCalledWith(1, values[0])
        expect(onNext).toHaveBeenNthCalledWith(2, values[1])
        expect(onError).not.toBeCalled()
        expect(onComplete).toBeCalled()
        expect(
          onNext.mock.invocationCallOrder.concat(
            onComplete.mock.invocationCallOrder
          )
        ).toMatchInlineSnapshot(`
          Array [
            5,
            6,
            7,
          ]
        `)
        done()
      }, 0)
    })
  })

  describe('error', () => {
    it('should create a static observable that immediately errors', done => {
      var err = new Error('boom')
      var observable = StaticObservable.error(err)
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      setTimeout(() => {
        expect(onNext).not.toHaveBeenCalled()
        expect(onError).toHaveBeenCalledWith(err)
        expect(onComplete).not.toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should ignore any calls after', done => {
      var values = [{}, {}]
      var err = new Error('boom')
      var observable = StaticObservable.error(err)
        .next(values[0])
        .next(values[1])
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      setTimeout(() => {
        expect(onNext).not.toHaveBeenCalled()
        expect(onError).toHaveBeenCalledWith(err)
        expect(onComplete).not.toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should work after subscribe', function(done) {
      var next = {}
      var err = new Error()
      var observable = StaticObservable.next(next)
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      // after subscribe
      observable.error(err)
      setTimeout(() => {
        expect(onNext).toHaveBeenCalledWith(next)
        expect(onError).toHaveBeenCalledWith(err)
        expect(onComplete).not.toHaveBeenCalled()
        expect(
          onNext.mock.invocationCallOrder.concat(
            onError.mock.invocationCallOrder
          )
        ).toMatchInlineSnapshot(`
          Array [
            10,
            11,
          ]
        `)
        done()
      }, 0)
    })
  })

  describe('complete', function() {
    it('should create a static observable that immediately completes', function(done) {
      var observable = StaticObservable.complete()
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      setTimeout(() => {
        expect(onNext).not.toHaveBeenCalled()
        expect(onError).not.toHaveBeenCalled()
        expect(onComplete).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should ignore any calls after', function(done) {
      var err = new Error('boom')
      var values = [{}, {}]
      var observable = StaticObservable.complete(err)
        .next(values[0])
        .next(values[1])
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete)
      setTimeout(() => {
        expect(onNext).not.toHaveBeenCalled()
        expect(onError).not.toHaveBeenCalled()
        expect(onComplete).toHaveBeenCalled()
        done()
      }, 0)
    })
  })

  describe('unsubscribe', () => {
    it('should ignore any next after', function(done) {
      var err = new Error('boom')
      var values = [{ foo: 1 }, { foo: 2 }]
      var observable = StaticObservable.next(values[0])
      var onNext = jest.fn()
      var onError = jest.fn()
      var onComplete = jest.fn()
      observable.subscribe(onNext, onError, onComplete).unsubscribe()
      observable.next(values[1])
      setTimeout(() => {
        expect(onNext).toHaveBeenCalledWith(values[0])
        expect(onNext).not.toHaveBeenCalledWith(values[1])
        expect(onError).not.toHaveBeenCalled()
        expect(onComplete).not.toHaveBeenCalled()
        done()
      }, 0)
    })
  })
})
