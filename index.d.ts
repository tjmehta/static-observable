declare module 'static-observable' {
  import { Observable } from 'rxjs'

  export default class StaticObservable<ValueType> extends Observable<
    ValueType
  > {
    static next(val: ValueType): StaticObservable<ValueType>
    static error(error: Error): StaticObservable<ValueType>
    static complete(): StaticObservable<ValueType>
    next(val: ValueType): this
    error(error: Error): this
    complete(): this
  }
}
