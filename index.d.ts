declare module 'static-observable' {
  import { Observable } from 'rxjs'

  export default class StaticObservable<ValueType> extends Observable<
    ValueType
  > {
    static next<ValueType>(val: ValueType): StaticObservable<ValueType>
    static error<ValueType>(error: Error): StaticObservable<ValueType>
    static complete<ValueType>(): StaticObservable<ValueType>
    next(val: ValueType): this
    error(error: Error): this
    complete(): this
  }
}
